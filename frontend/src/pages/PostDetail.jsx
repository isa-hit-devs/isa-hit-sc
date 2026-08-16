import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchPostById } from '../services/api';

export default function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError('');

    fetchPostById(id)
      .then((data) => {
        if (isMounted) {
          setPost(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.response?.data?.message || 'Article not found');
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-white via-blue-50 to-blue-100 pt-24 pb-12">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent mb-4" />
        <p className="text-sm font-semibold text-slate-600">Loading Article...</p>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-white via-blue-50 to-blue-100 px-6 pt-24 pb-12 text-center">
        <div className="max-w-md bg-white/90 backdrop-blur-md rounded-3xl p-8 border border-blue-100 shadow-xl">
          <div className="text-4xl mb-4">📖</div>
          <h1 className="text-2xl font-extrabold text-slate-900 mb-2">Article Not Found</h1>
          <p className="text-sm text-slate-600 mb-6">{error || 'The requested article could not be loaded.'}</p>
          <Link
            to="/"
            className="inline-flex items-center justify-center px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition shadow-md shadow-blue-500/20"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <article className="min-h-screen w-full bg-gradient-to-br from-white via-blue-50 to-blue-100 pt-28 pb-20 px-6 sm:px-12 md:px-16 lg:px-24">
      <div className="mx-auto max-w-4xl">
        {/* Back Link */}
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-blue-600 transition"
          >
            <span>←</span> Back to Home
          </Link>
        </div>

        {/* Card Header Container */}
        <div className="overflow-hidden rounded-3xl bg-white/90 border border-blue-100/80 shadow-xl shadow-blue-500/5 backdrop-blur-xl">
          {/* Article Banner Image */}
          {post.image && (
            <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-900">
              <img
                src={post.image}
                alt={post.title}
                className="h-full w-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
            </div>
          )}

          {/* Article Body Content */}
          <div className="p-6 sm:p-10 md:p-12">
            <div className="flex items-center gap-3 mb-4">
              {post.category && (
                <span className="inline-block rounded-full bg-blue-50 px-3.5 py-1 text-xs font-extrabold uppercase tracking-wider text-blue-600 border border-blue-100">
                  {post.category}
                </span>
              )}
              {post.createdAt && (
                <span className="text-xs text-slate-400 font-medium">
                  {new Date(post.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight mb-6">
              {post.title}
            </h1>

            {/* Author / ISA Badge */}
            <div className="flex items-center gap-3 border-y border-slate-100 py-4 mb-8">
              <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-blue-700 to-blue-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
                ISA
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800 leading-none">ISA HIT Student Chapter</p>
                <p className="text-[11px] text-slate-500 mt-1">Official Technical Article</p>
              </div>
            </div>

            {/* Detailed Description */}
            <div className="prose prose-slate max-w-none text-slate-700 text-base sm:text-lg leading-relaxed whitespace-pre-line">
              {post.description}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
