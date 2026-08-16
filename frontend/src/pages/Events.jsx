import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchPosts } from '../services/api';

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    fetchPosts('General')
      .then((data) => {
        if (isMounted) {
          setEvents(Array.isArray(data) ? data : []);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('Error fetching event posts:', err);
        if (isMounted) {
          setEvents([]);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-white via-blue-50 to-blue-100 pt-28 pb-20 px-6 sm:px-12 md:px-16 lg:px-24">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center md:text-left mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-bold uppercase tracking-wider mb-3">
            ISA HIT Student Chapter
          </span>
          <h1 className="text-4xl font-extrabold text-slate-900 sm:text-5xl md:text-6xl">
            Events & <span className="bg-gradient-to-b from-blue-900 to-blue-600 bg-clip-text text-transparent">General Posts</span>
          </h1>
          <p className="mt-4 text-base text-slate-600 max-w-2xl">
            Explore past events, announcements, workshops, and chapter activities organized by the International Society of Automation.
          </p>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          </div>
        ) : events.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-md rounded-3xl border border-blue-100/80 p-12 text-center shadow-xs">
            <div className="text-4xl mb-3">📅</div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">No General Events Found</h3>
            <p className="text-sm text-slate-600 max-w-md mx-auto">
              No event announcements have been published in the "General" category yet. Create event posts in the Admin Portal to publish them here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <Link
                key={event._id}
                to={`/post/${event._id}`}
                className="group overflow-hidden rounded-3xl border border-blue-100/80 bg-white/90 shadow-md shadow-blue-500/5 backdrop-blur-md transition hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/10 flex flex-col justify-between"
              >
                <div>
                  <div className="aspect-[4/3] w-full overflow-hidden bg-blue-50 relative">
                    {event.image ? (
                      <img
                        src={event.image}
                        alt={event.title}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-blue-300 font-bold text-xl">
                        ISA Event
                      </div>
                    )}
                    <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-extrabold uppercase text-blue-600 border border-blue-100 shadow-xs">
                      General Event
                    </span>
                  </div>

                  <div className="p-5">
                    <h3 className="text-lg font-bold leading-snug text-slate-900 transition group-hover:text-blue-600 line-clamp-2">
                      {event.title}
                    </h3>
                    {event.description && (
                      <p className="mt-2 text-xs text-slate-600 line-clamp-3 leading-relaxed">
                        {event.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="px-5 pb-5 pt-2 flex items-center justify-between border-t border-slate-100">
                  <span className="text-[11px] font-semibold text-slate-400">
                    {event.createdAt ? new Date(event.createdAt).toLocaleDateString() : 'ISA Chapter'}
                  </span>
                  <span className="text-xs font-bold text-blue-600 group-hover:translate-x-1 transition-transform">
                    View Details →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
