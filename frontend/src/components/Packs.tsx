import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

interface Pack {
  id: number;
  travelDate: string;
  type: string;
  repository: number;
  company?: string;
  plate?: string;
  driver?: string;
  driverPhone?: string;
}

const Packs = () => {
  const [packs, setPacks] = useState<Pack[]>([]);
  const [typeFilter, setTypeFilter] = useState('');
  const [error, setError] = useState('');
  const { token } = useContext(AuthContext);

  useEffect(() => {
    const fetchPacks = async () => {
      try {
        const response = await axios.get('http://localhost:3000/packs', {
          params: { type: typeFilter },
          headers: { Authorization: `Bearer ${token}` },
        });
        setPacks(response.data);
        setError('');
      } catch (err: any) {
        console.error('Fetch packs error:', err.response?.data || err.message);
        setError('Failed to load packs. Please try again.');
      }
    };
    if (token) fetchPacks();
  }, [token, typeFilter]);

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Packs</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="mb-4 flex justify-between">
        <div>
          <label className="mr-2">Filter by Type:</label>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="">All</option>
            <option value="normal">Normal</option>
            <option value="vip">VIP</option>
          </select>
        </div>
        <Link
          to="/packs/create"
          className="bg-green-500 text-white p-2 rounded hover:bg-green-600"
        >
          Create New Pack
        </Link>
      </div>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">ID</th>
            <th className="p-2 border">Type</th>
            <th className="p-2 border">Travel Date</th>
            <th className="p-2 border">Company</th>
          </tr>
        </thead>
        <tbody>
          {packs.map((pack) => (
            <tr key={pack.id}>
              <td className="p-2 border">{pack.id}</td>
              <td className="p-2 border">{pack.type}</td>
              <td className="p-2 border">{new Date(pack.travelDate).toLocaleDateString()}</td>
              <td className="p-2 border">{pack.company || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Packs;