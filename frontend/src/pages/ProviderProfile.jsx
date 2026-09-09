import { useState, useEffect } from 'react';
import API from '../api/axios';

function ProviderProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bio, setBio] = useState('');
  const [skills, setSkills] = useState('');
  const [experience, setExperience] = useState('');
  const [pricing, setPricing] = useState('');
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [exists, setExists] = useState(true);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await API.get('/providers/profile');
      setProfile(res.data);
      setBio(res.data.bio || '');
      setSkills((res.data.skills || []).join(', '));
      setExperience(res.data.experience || '');
      setPricing(res.data.pricing || '');
      setExists(true);
    } catch (err) {
      setExists(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const skillsArray = skills.split(',').map((s) => s.trim()).filter(Boolean);
      await API.post('/providers/profile', {
        bio,
        skills: skillsArray,
        experience,
        pricing,
      });
      setMessage('Profile created successfully!');
      fetchProfile();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to create profile');
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const formData = new FormData();
      formData.append('bio', bio);
      skills
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
        .forEach((s) => formData.append('skills', s));
      formData.append('experience', experience);
      formData.append('pricing', pricing);
      if (file) {
        formData.append('profilePicture', file);
      }

      await API.put('/providers/profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setMessage('Profile updated successfully!');
      setFile(null);
      fetchProfile();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to update profile');
    }
  };

  if (loading) return <p className="text-black dark:text-white p-6">Loading...</p>;

  return (
    <div className="min-h-screen bg-white dark:bg-black p-6 max-w-xl mx-auto">
      <h1 className="text-xl font-semibold text-black dark:text-white mb-4">My Profile</h1>

      {exists && profile?.profilePicture && (
        <img
          src={profile.profilePicture}
          alt="Profile"
          className="w-24 h-24 rounded-full object-cover border border-black dark:border-white mb-4"
        />
      )}

      <form
        onSubmit={exists ? handleUpdate : handleCreate}
        className="border border-black dark:border-white rounded-lg p-4"
      >
        {message && <p className="text-sm text-green-600 mb-3">{message}</p>}

        <label className="text-sm text-black dark:text-white block mb-1">Bio</label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="w-full border border-black dark:border-white rounded px-2 py-1 mb-3 text-black dark:text-white dark:bg-black"
          rows="3"
        />

        <label className="text-sm text-black dark:text-white block mb-1">
          Skills (comma separated)
        </label>
        <input
          type="text"
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
          placeholder="e.g. Web Development, Logo Design"
          className="w-full h-9 border border-black dark:border-white rounded px-2 mb-3 text-black dark:text-white dark:bg-black"
        />

        <label className="text-sm text-black dark:text-white block mb-1">Experience</label>
        <input
          type="text"
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
          placeholder="e.g. 3 years"
          className="w-full h-9 border border-black dark:border-white rounded px-2 mb-3 text-black dark:text-white dark:bg-black"
        />

        <label className="text-sm text-black dark:text-white block mb-1">Pricing (NPR)</label>
        <input
          type="number"
          value={pricing}
          onChange={(e) => setPricing(e.target.value)}
          className="w-full h-9 border border-black dark:border-white rounded px-2 mb-3 text-black dark:text-white dark:bg-black"
        />

        {exists && (
          <>
            <label className="text-sm text-black dark:text-white block mb-1">Profile Picture</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files[0])}
              className="w-full text-sm text-black dark:text-white mb-4"
            />
          </>
        )}

        <button type="submit" className="w-full h-9 bg-black dark:bg-white text-white dark:text-black rounded text-sm">
          {exists ? 'Save Changes' : 'Create Profile'}
        </button>
      </form>
    </div>
  );
}

export default ProviderProfile;