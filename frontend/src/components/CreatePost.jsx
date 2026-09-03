import { useState } from 'react';
import './CreatePost.css';

const emptyErrors = { image: '', description: '' };

export default function CreatePost() {
    const [imageName, setImageName] = useState('');
    const [description, setDescription] = useState('');
    const [hashtags, setHashtags] = useState('');
    const [errors, setErrors] = useState(emptyErrors);
    const [submitted, setSubmitted] = useState(false);

    function validate(nextImageName, nextDescription) {
        const nextErrors = { ...emptyErrors };

        if (!nextImageName) {
            nextErrors.image = 'Please attach an image for your post.';
        }
        if (!nextDescription.trim()) {
            nextErrors.description = 'A description is required.';
        } else if (nextDescription.trim().length < 8) {
            nextErrors.description = 'Description must be at least 8 characters.';
        }

        setErrors(nextErrors);
        return !nextErrors.image && !nextErrors.description;
    }

    function handleFileChange(event) {
        const file = event.target.files?.[0];
        const name = file ? file.name : '';
        setImageName(name);
        validate(name, description);
    }

    function handleDescriptionChange(event) {
        const value = event.target.value;
        setDescription(value);
        validate(imageName, value);
    }

    function handleSubmit(event) {
        event.preventDefault();
        const isValid = validate(imageName, description);
        if (!isValid) return;

        console.log('Post created (stub):', { imageName, description, hashtags });
        setSubmitted(true);
        setImageName('');
        setDescription('');
        setHashtags('');
        setErrors(emptyErrors);
    }

    const isValid = imageName && description.trim().length >= 8;

    return (
        <form className="create-post card" onSubmit={handleSubmit} noValidate>
            <h3 className="create-post__title">Create a post</h3>

            <label className="create-post__drop" htmlFor="post-image">
                {imageName ? imageName : 'Drop image here / click to upload'}
            </label>
            <input
                id="post-image"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="create-post__file-input"
            />
            {errors.image && <p className="field-error">{errors.image}</p>}

            <div className="field">
                <label htmlFor="post-description">Description</label>
                <textarea
                    id="post-description"
                    rows={3}
                    value={description}
                    onChange={handleDescriptionChange}
                    className={errors.description ? 'invalid' : ''}
                    placeholder="What's the story behind this shot?"
                />
                {errors.description && <p className="field-error">{errors.description}</p>}
            </div>

            <div className="field">
                <label htmlFor="post-hashtags">Hashtags</label>
                <input
                    id="post-hashtags"
                    type="text"
                    value={hashtags}
                    onChange={(event) => setHashtags(event.target.value)}
                    placeholder="#photography #capetown"
                />
            </div>

            <button type="submit" className="btn btn-gold create-post__submit" disabled={!isValid}>
                Post
            </button>

            {submitted && <p className="create-post__success">Your post has been shared.</p>}
        </form>
    );
}