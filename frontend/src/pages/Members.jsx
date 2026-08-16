import React, { useState, useEffect } from 'react';
import { fetchMembers } from '../services/api';

export default function Members() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    fetchMembers()
      .then((data) => {
        if (isMounted) {
          setMembers(Array.isArray(data) ? data : []);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('Error fetching chapter members:', err);
        if (isMounted) {
          setMembers([]);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const coreMembers = members.filter((m) => m.category === 'core-member');
  const generalMembers = members.filter((m) => m.category === 'member' || !m.category);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-white via-blue-50 to-blue-100 pt-28 pb-20 px-6 sm:px-12 md:px-16 lg:px-24">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center md:text-left mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-bold uppercase tracking-wider mb-3">
            ISA HIT Student Chapter
          </span>
          <h1 className="text-4xl font-extrabold text-slate-900 sm:text-5xl md:text-6xl">
            Our <span className="bg-gradient-to-b from-blue-900 to-blue-600 bg-clip-text text-transparent">Team & Members</span>
          </h1>
          <p className="mt-4 text-base text-slate-600 max-w-2xl">
            Meet the passionate engineers, leaders, developers, and creators driving automation excellence at Haldia Institute of Technology.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          </div>
        ) : members.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-md rounded-3xl border border-blue-100/80 p-12 text-center shadow-xs">
            <div className="text-4xl mb-3">👥</div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">No Members Listed Yet</h3>
            <p className="text-sm text-slate-600 max-w-md mx-auto">
              No team members have been added to the chapter database yet. Add members in the Admin Portal to showcase them here.
            </p>
          </div>
        ) : (
          <div className="space-y-16">
            {/* Core Members Section */}
            {coreMembers.length > 0 && (
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900 mb-8 border-l-4 border-blue-600 pl-4">
                  Core Leadership Team
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {coreMembers.map((member) => (
                    <div
                      key={member._id}
                      className="bg-white/90 backdrop-blur-md border border-blue-100/80 rounded-3xl p-6 text-center shadow-md shadow-blue-500/5 transition hover:-translate-y-1 hover:shadow-xl flex flex-col items-center"
                    >
                      <div className="relative mb-4">
                        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-600 to-blue-400 blur-sm opacity-40 scale-105" />
                        <img
                          src={member.image}
                          alt={member.name}
                          className="relative h-24 w-24 object-cover rounded-full border-4 border-white shadow-md"
                          onError={(e) => {
                            e.currentTarget.src = 'https://via.placeholder.com/150?text=ISA';
                          }}
                        />
                      </div>
                      <h3 className="text-base font-bold text-slate-900">{member.name}</h3>
                      <p className="text-xs font-semibold text-blue-600 mt-1">{member.position}</p>
                      <span className="mt-3 inline-block px-3 py-1 rounded-full bg-blue-50 text-[10px] font-bold text-blue-700 uppercase tracking-wider border border-blue-100">
                        Core Member
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Chapter Members Section */}
            {generalMembers.length > 0 && (
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900 mb-8 border-l-4 border-blue-400 pl-4">
                  Chapter Members
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {generalMembers.map((member) => (
                    <div
                      key={member._id}
                      className="bg-white/80 backdrop-blur-md border border-blue-100/60 rounded-3xl p-5 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-md flex flex-col items-center"
                    >
                      <img
                        src={member.image}
                        alt={member.name}
                        className="h-20 w-20 object-cover rounded-full border-2 border-white shadow-sm mb-3"
                        onError={(e) => {
                          e.currentTarget.src = 'https://via.placeholder.com/150?text=ISA';
                        }}
                      />
                      <h3 className="text-sm font-bold text-slate-900">{member.name}</h3>
                      <p className="text-xs font-semibold text-slate-600 mt-0.5">{member.position}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
