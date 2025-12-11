IMPORTANT: You must copy your ZKLive10R SDK files here.

1. Copy header files (.h) to `sdk/include/`
   - Example: zkfp.h, libzkfptype.h

2. Copy library files (.lib) to `sdk/lib/`
   - Example: libzkfp.lib

3. Copy DLL files (.dll) to `sdk/lib/`
   - Example: libzkfp.dll, ZKLiveFinger.dll

The `binding.gyp` file is configured to look for files in these locations.
