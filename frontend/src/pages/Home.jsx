import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import { fetchPosts } from '../services/api';

export function TechArticles() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    fetchPosts()
      .then((data) => {
        if (isMounted) {
          if (Array.isArray(data)) {
            setArticles(data);
          } else {
            setArticles([]);
          }
          setLoading(false);
        }
      })
      .catch((err) => {
        console.warn('Error fetching tech articles from API:', err);
        if (isMounted) {
          setArticles([]);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="bg-gradient-to-br from-white via-blue-50 to-blue-100 px-6 py-20 sm:px-12 md:px-16 lg:px-24">
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-12 text-center text-3xl font-extrabold text-slate-800 sm:text-4xl md:text-left">
          Tech{" "}
          <span className="bg-gradient-to-b from-blue-900 to-blue-600 bg-clip-text text-transparent">
            Articles
          </span>
        </h2>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          </div>
        ) : articles.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-blue-100/80 p-8 text-center text-slate-500 text-sm shadow-xs">
            No tech articles published yet. Articles created in the Admin Portal will appear here.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article, i) => (
              <Link
                key={article._id || i}
                to={article._id ? `/post/${article._id}` : "#"}
                className="group overflow-hidden rounded-2xl border border-blue-100/80 bg-white/90 shadow-md shadow-blue-500/5 backdrop-blur-md transition hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/10 flex flex-col justify-between"
              >
                <div>
                  <div className="aspect-[4/3] w-full overflow-hidden bg-blue-50">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                  <div className="p-4">
                    {article.category && (
                      <span className="inline-block mb-1 text-[11px] font-bold uppercase tracking-wider text-blue-600">
                        {article.category}
                      </span>
                    )}
                    <h3 className="text-base font-semibold leading-snug text-slate-800 transition group-hover:text-blue-600 md:text-lg">
                      {article.title}
                    </h3>
                    {article.description && (
                      <p className="mt-2 text-xs text-slate-600 line-clamp-2">
                        {article.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="px-4 pb-4 pt-1 flex items-center justify-between text-xs text-slate-400 border-t border-slate-100">
                  <span>Read Article</span>
                  <span className="font-bold text-blue-600 group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <main className="w-full">
      <Hero />
      <TechArticles />
    </main>
  );
}