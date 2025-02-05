import React, { useState } from 'react';
import { Search, Phone, Mail, MapPin } from 'lucide-react';

const ContactsDisplay = () => {
  const contacts = [
    {
      id: 1,
      name: 'Dr. Lakshmi Kant Mishra',
      role: 'Member, DDPC, CED [31-07-2019 till date]',
      phone: '5322271312(O) 5322271701(R) 9936415588(M)',
      email: 'lkm@mnnit.ac.in',
      department: 'Department of Civil Engineering',
      avatar: 'src/assets/images/Dr.LKMishra.jpg'
    },
    {
      id: 2,
      name: 'Dr. Stephen Strange',
      role: 'Member, DDPC, CED [31-07-2019 till date]',
      phone: '5322271312(O) 5322271701(R) 9936415588(M)',
      email: 'lkm@mnnit.ac.in',
      department: 'Department of Civil Engineering',
      avatar: '/'
    },
  ];

  const [searchTerm, setSearchTerm] = useState('');

  // Filter contacts based on search term
  const filteredContacts = contacts.filter(contact => {
    const searchString = searchTerm.toLowerCase();
    return (
      contact.name.toLowerCase().includes(searchString) ||
      contact.role.toLowerCase().includes(searchString) ||
      contact.email.toLowerCase().includes(searchString) ||
      contact.department.toLowerCase().includes(searchString) ||
      contact.phone.includes(searchString)
    );
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-violet-800 to-fuchsia-700 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
          MNNIT Contacts Directory
        </h1>

        {/* Search Bar */}
        <div className="mb-8 relative">
          <Search className="absolute left-4 top-3 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Search contacts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-slate-800/50 rounded-lg border border-slate-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
          />
        </div>

        {/* Contacts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredContacts.length > 0 ? (
            filteredContacts.map(contact => (
              <div
                key={contact.id}
                className="bg-slate-800/50 backdrop-blur-lg rounded-lg p-7 border border-slate-700 hover:border-purple-500 transition-all"
              >
                <div className="flex flex-col items-center gap-4 mb-6">
                  <img
                    src={contact.avatar}
                    alt={contact.name}
                    className="w-32 h-32 rounded bg-purple-500/20"
                  />
                  <div className="text-center">
                    <h3 className="text-2xl font-semibold">{contact.name}</h3>
                    <p className="text-purple-400 text-l">{contact.role}</p>
                  </div>
                </div>

                <div className="space-y-4 text-slate-300">
                  <div className="flex items-center gap-3">
                    <Phone size={20} className="text-slate-400" />
                    <span className="text-l">{contact.phone}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail size={20} className="text-slate-400" />
                    <span className="text-l">{contact.email}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin size={20} className="text-slate-400" />
                    <span className="text-l">{contact.department}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-8 text-slate-400">
              No contacts found matching your search.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactsDisplay;