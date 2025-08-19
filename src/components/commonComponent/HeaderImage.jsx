import { Skeleton } from "antd";
import { useState } from "react";
import PropTypes from "prop-types";
import T from "../baseComponents/text/T";

export default function HeaderImage({
  url,
  name,
  textSize,
  isUploading = false,
}) {
  const [loading, setLoading] = useState(!!url);
  const initials = name && name.length >= 2 ? `${name[0]}${name[1]}` : "??";
  const handleImageError = () => {
    setLoading(false);
  };
  return (
    <div className="w-full h-full rounded-full flex items-center justify-center relative">
      {/* Show Skeleton while loading */}
      {(loading || isUploading) && (
        <Skeleton.Avatar active size="large" className="absolute" />
      )}

      {url && !isUploading ? (
        <img
          // src={url}
          // src={appendCacheBuster(url)}
          alt="profile image"
          className={`w-full h-full rounded-full ${
            loading ? "hidden" : "block"
          }`}
          onLoad={() => setLoading(false)}
          onError={handleImageError}
        />
      ) : (
        !loading && (
          <div className="w-full h-full flex items-center justify-center rounded-full bg-colorPrimary">
            <T
              variant={`h${textSize}`}
              className={`text-colorSelected font-semibold uppercase`}
            >
              {initials}
            </T>
          </div>
        )
      )}
    </div>
  );
}
HeaderImage.propTypes = {
  url: PropTypes.string,
  name: PropTypes.string.isRequired,
  textSize: PropTypes.number.isRequired,
  isUploading: PropTypes.bool,
};
