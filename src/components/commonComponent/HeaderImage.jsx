import { Skeleton } from "antd";
import { useState } from "react";
import PropTypes from "prop-types";
import UserAvatar from "../../assets/images/userAvator";

export default function HeaderImage({
  url,
  name,
  textSize,
  isUploading = false,
}) {
  const [loading, setLoading] = useState(!!url);

  const handleImageError = () => {
    setLoading(false);
  };

  return (
    <div className="w-full h-full rounded-full flex items-center justify-center relative overflow-hidden">
      {/* Show Skeleton while loading */}
      {(loading || isUploading) && (
        <Skeleton.Avatar active size="large" className="absolute" />
      )}

      {url && !isUploading ? (
        <img
          src={url}
          alt="profile image"
          className={`w-full h-full rounded-full object-cover ${loading ? "hidden" : "block"
            }`}
          onLoad={() => setLoading(false)}
          onError={handleImageError}
        />
      ) : (
        !loading && (
          <div className="w-full h-full flex items-center justify-center rounded-full overflow-hidden">
            <UserAvatar className="w-full h-full" />
          </div>
        )
      )}
    </div>
  );
}

HeaderImage.propTypes = {
  url: PropTypes.string,
  name: PropTypes.string,
  textSize: PropTypes.number,
  isUploading: PropTypes.bool,
};
