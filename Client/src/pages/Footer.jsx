import React from 'react'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white px-6 py-10 mt-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-28">
        <div>
          <h2 className='text-4xl font-bold text-white'>TalkTrack</h2>
          <p className="text-sm mt-4 text-gray-400">
            TalkTrack helps you navigate tech careers with guided roadmaps and expert advice.
          </p>
        </div>
        <div>
          <h3 className="font-semibold text-lg mb-3">Navigation</h3>
          <ul className="space-y-2 text-gray-300 text-sm">
            <li><Link to="/" className="hover:text-white">Home</Link></li>
            <li><Link to="/roadmap" className="hover:text-white">Roadmaps</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold text-lg mb-3">Connect with us</h3>
          <ul className="space-y-2 text-gray-300 text-sm">
            <li>Email: <a href="mailto:support@talktrack.dev" className="hover:text-white">support@talktrack.dev</a></li>
            <li>
              <a href="https://twitter.com" className="hover:text-white" target="_blank" rel="noopener noreferrer">
                Twitter
              </a>
            </li>
            <li>
              <a href="https://github.com" className="hover:text-white" target="_blank" rel="noopener noreferrer">
                GitHub
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="mt-10 text-center text-lg text-gray-500 border-t border-gray-700 pt-4">
        © {new Date().getFullYear()} TalkTrack. All rights reserved.
      </div>
    </footer>
  )
}
