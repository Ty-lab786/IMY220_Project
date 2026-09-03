import './PostImage.css';

export default function PostImage({ src, alt = 'Post image (full size)' }) {
    if (!src) {
        return (
            <div className="post-image post-image--placeholder">
                <span>Post image (full size)</span>
            </div>
        );
    }

    return (
        <div className="post-image">
            <img src={src} alt={alt} />
        </div>
    );
}