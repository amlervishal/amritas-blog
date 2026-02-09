'use client'
import Link from 'next/link'; import { } from 'next/navigation';
import ShareButton from './ShareButton';

const truncateText = (text, wordLimit = 15) => {
  const words = text.split(/\s+/);
  if (words.length > wordLimit) {
    return words.slice(0, wordLimit).join(' ') + '...';
  }
  return text;
};

const stripHtml = (html) => {
  // Remove HTML comments (including MSO style definitions pasted from Word)
  let cleaned = html.replace(/<!--[\s\S]*?-->/g, '');
  // Remove <style> blocks and their contents
  cleaned = cleaned.replace(/<style[\s\S]*?<\/style>/gi, '');
  // Remove MSO conditional comments (e.g. <!--[if gte mso 9]>...<![endif]-->)
  cleaned = cleaned.replace(/<!--\[if[\s\S]*?<!\[endif\]-->/gi, '');
  const tmp = document.createElement('DIV');
  tmp.innerHTML = cleaned;
  return tmp.textContent || tmp.innerText || '';
};

// Simplified function to check if the user's email is allowed to edit
const isAllowedToEdit = (userEmail) => {
  const allowedEmails = ['amlervishal@gmail.com', 'dramritavohra@gmail.com']; // Replace with your specific Gmail addresses
  return allowedEmails.includes(userEmail);
};

const Posts = ({ posts, user }) => {
  if (!Array.isArray(posts)) {
    // console.error('Posts is not an array:', posts);
    return <div>Error: Posts data is not in the expected format.</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post) => {
        const postId = post.id;

        return (
          <div key={postId} className="rounded-lg bg-gray-300/30 relative overflow-hidden shadow-lg">
            <img 
              src={post.imageUrl || '/default-image.jpg'} 
              alt={post.title} 
              className="w-full h-96 object-cover brightness-75 scale-110 transition-all duration-300 hover:scale-100"
            />
            
            <div className='absolute top-0 right-0 p-8 text-right'>
              <Link href={`/post/${postId}`} className="text-white drop-shadow font-Primary text-2xl font-medium hover:underline">
                {post.title || 'Untitled Post'}
              </Link>
              <p className="text-gray-200 font-Primary py-1 text-sm">
                {post.createdAt?.toDate().toLocaleDateString()}
              </p>
              <div className="pt-1">
                <ShareButton
                  postId={postId}
                  title={post.title || 'Untitled Post'}
                  description={truncateText(stripHtml(post.content || 'No content'), 25)}
                  imageUrl={post.imageUrl}
                />
              </div>
              {isAllowedToEdit(user?.email) && (
                <Link href={`/edit/${postId}`} className="text-rose-600 hover:underline">
                  Edit
                </Link>
              )}
            </div>

            <div className="absolute bottom-0 left-0 p-8">
              <p className="text-gray-50 font-Primary drop-shadow text-sm">
                {truncateText(stripHtml(post.content || 'No content'))}
              </p>
              <Link href={`/post/${postId}`} className="text-white/60 drop-shadow font-Primary text-sm hover:text-rose-600 mt-2 inline-block">
                Read more
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Posts;