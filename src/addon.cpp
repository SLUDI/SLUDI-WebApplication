#include <napi.h>
#include <iostream>
#include <windows.h>
#include <thread>
#include <atomic>
#include <chrono>
#include "libzkfp.h"
#include "libzkfperrdef.h"

// Global device handle
// Global device handle
static HANDLE g_hDevice = NULL;
static int g_imgWidth = 0;
static int g_imgHeight = 0;

// Threading globals
std::thread nativeThread;
Napi::ThreadSafeFunction tsfn;
std::atomic<bool> g_isCapturing(false);

Napi::Value Initialize(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();
    int ret = ZKFPM_Init();
    if (ret == ZKFP_ERR_OK) {
        return Napi::Boolean::New(env, true);
    }
    return Napi::Boolean::New(env, false);
}

Napi::Value GetDeviceCount(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();
    int count = ZKFPM_GetDeviceCount();
    return Napi::Number::New(env, count);
}

Napi::Value OpenDevice(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();
    g_hDevice = ZKFPM_OpenDevice(0);
    if (g_hDevice != NULL) {
        // Get Parameters
        unsigned int size = 4;
        ZKFPM_GetParameters(g_hDevice, 1, (unsigned char*)&g_imgWidth, &size);
        size = 4;
        ZKFPM_GetParameters(g_hDevice, 2, (unsigned char*)&g_imgHeight, &size);
        
        std::cout << "DEVICE OPENED. Size: " << g_imgWidth << "x" << g_imgHeight << std::endl;
        
        return Napi::Boolean::New(env, true);
    }
    return Napi::Boolean::New(env, false);
}

// Base64 helper
static const std::string base64_chars = 
             "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
             "abcdefghijklmnopqrstuvwxyz"
             "0123456789+/";

std::string base64_encode(unsigned char const* bytes_to_encode, unsigned int in_len) {
  std::string ret;
  int i = 0;
  int j = 0;
  unsigned char char_array_3[3];
  unsigned char char_array_4[4];

  while (in_len--) {
    char_array_3[i++] = *(bytes_to_encode++);
    if (i == 3) {
      char_array_4[0] = (char_array_3[0] & 0xfc) >> 2;
      char_array_4[1] = ((char_array_3[0] & 0x03) << 4) + ((char_array_3[1] & 0xf0) >> 4);
      char_array_4[2] = ((char_array_3[1] & 0x0f) << 2) + ((char_array_3[2] & 0xc0) >> 6);
      char_array_4[3] = char_array_3[2] & 0x3f;

      for(i = 0; (i <4) ; i++)
        ret += base64_chars[char_array_4[i]];
      i = 0;
    }
  }

  if (i) {
    for(j = i; j < 3; j++)
      char_array_3[j] = '\0';

    char_array_4[0] = (char_array_3[0] & 0xfc) >> 2;
    char_array_4[1] = ((char_array_3[0] & 0x03) << 4) + ((char_array_3[1] & 0xf0) >> 4);
    char_array_4[2] = ((char_array_3[1] & 0x0f) << 2) + ((char_array_3[2] & 0xc0) >> 6);
    char_array_4[3] = char_array_3[2] & 0x3f;

    for (j = 0; (j < i + 1); j++)
      ret += base64_chars[char_array_4[j]];

    while((i++ < 3))
      ret += '=';
  }

  return ret;
}

// The background thread function
void CaptureLoop() {
    unsigned char fpImage[512 * 288]; // Standard size for ZKLive10R is often this or similar. 
                                      // Note: Safest to check GetParameters but hardcoding for now based on context.
    unsigned char fpTemplate[2048];
    unsigned int cbTemplate = 2048;

    while (g_isCapturing) {
        if (g_hDevice == NULL) {
            std::this_thread::sleep_for(std::chrono::milliseconds(100));
            continue;
        }

        cbTemplate = 2048; // Reset buffer size
        int ret = ZKFPM_AcquireFingerprint(g_hDevice, fpImage, sizeof(fpImage), fpTemplate, &cbTemplate);

        if (ret == ZKFP_ERR_OK) {
            // Convert template to hex string
            std::string templateHex;
            char hexStr[3];
            for (unsigned int i = 0; i < cbTemplate; i++) {
                sprintf(hexStr, "%02X", fpTemplate[i]);
                templateHex += hexStr;
            }

            // Encode Image to Base64
            // Use actual device size from GetParameters
            int imgSize = g_imgWidth * g_imgHeight;
            if (imgSize <= 0) imgSize = 512 * 288; // Fallback
            
            std::string imageBase64 = base64_encode(fpImage, imgSize);

            // Call back into JS
            auto callback = [templateHex, imageBase64](Napi::Env env, Napi::Function jsCallback) {
                // Pass (template, image)
                jsCallback.Call({
                    Napi::String::New(env, templateHex),
                    Napi::String::New(env, imageBase64)
                });
            };
            
            tsfn.BlockingCall(callback);
        }

        // Sleep to avoid busy loop and high CPU usage
        std::this_thread::sleep_for(std::chrono::milliseconds(100));
    }

    // Release the thread-safe function
    tsfn.Release();
}

Napi::Value StartCapture(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();

    if (info.Length() < 1 || !info[0].IsFunction()) {
        Napi::TypeError::New(env, "Callback function expected").ThrowAsJavaScriptException();
        return env.Null();
    }

    if (g_isCapturing) {
        return Napi::Boolean::New(env, false); // Already capturing
    }

    g_isCapturing = true;

    // Create a ThreadSafeFunction
    tsfn = Napi::ThreadSafeFunction::New(
        env,
        info[0].As<Napi::Function>(),
        "CaptureResource",
        0,
        1
    );

    // Start the native thread
    nativeThread = std::thread(CaptureLoop);

    return Napi::Boolean::New(env, true);
}

Napi::Value StopCapture(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();
    
    if (g_isCapturing) {
        g_isCapturing = false;
        if (nativeThread.joinable()) {
            nativeThread.join();
        }
        return Napi::Boolean::New(env, true);
    }
    return Napi::Boolean::New(env, false);
}

Napi::Value CloseDevice(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();
    
    // Ensure capture is stopped before closing
    if (g_isCapturing) {
        g_isCapturing = false;
        if (nativeThread.joinable()) {
            nativeThread.join();
        }
    }

    if (g_hDevice != NULL) {
        ZKFPM_CloseDevice(g_hDevice);
        g_hDevice = NULL;
    }
    return Napi::Boolean::New(env, true);
}

Napi::Value Terminate(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();
    
    // Ensure capture is stopped
    if (g_isCapturing) {
        g_isCapturing = false;
        if (nativeThread.joinable()) {
            nativeThread.join();
        }
    }

    ZKFPM_Terminate();
    return Napi::Boolean::New(env, true);
}

Napi::Object Init(Napi::Env env, Napi::Object exports) {
    exports.Set(Napi::String::New(env, "initialize"), Napi::Function::New(env, Initialize));
    exports.Set(Napi::String::New(env, "getDeviceCount"), Napi::Function::New(env, GetDeviceCount));
    exports.Set(Napi::String::New(env, "openDevice"), Napi::Function::New(env, OpenDevice));
    exports.Set(Napi::String::New(env, "startCapture"), Napi::Function::New(env, StartCapture));
    exports.Set(Napi::String::New(env, "stopCapture"), Napi::Function::New(env, StopCapture));
    exports.Set(Napi::String::New(env, "closeDevice"), Napi::Function::New(env, CloseDevice));
    exports.Set(Napi::String::New(env, "terminate"), Napi::Function::New(env, Terminate));
    return exports;
}

NODE_API_MODULE(zkfinger, Init)
