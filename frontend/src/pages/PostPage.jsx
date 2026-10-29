import { useParams } from 'react-router-dom';
import Post from '../components/Post.jsx';
import Comments from '../components/Comments.jsx';
import './PostPage.css';

export default function PostPage() {
    const { id } = useParams();

    return (
        <div className="page-shell post-page-route">
            <Post key={id} postId={id} />
            <Comments key={`c-${id}`} postId={id} />
        </div>
    );
}