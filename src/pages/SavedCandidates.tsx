import { useEffect, useState } from "react";
import Candidate from '../interfaces/Candidate.interface';

const SavedCandidates = () => {

  const [candidates, setCandidates] = useState<Candidate[]>([]);

  const [error, setError] = useState<string | null>(null);

  const [sortCriteria, setSortCriteria] = useState<string>('');

  const [filterText, setFilterText] = useState<string>('');

useEffect(() => {
  console.log('Stored candidates:', candidates);
  const fetchCandidates = () => {
    const storedCandidates = localStorage.getItem('candidates');
    if (typeof storedCandidates === 'string' && storedCandidates.length > 0) {
      setCandidates(JSON.parse(storedCandidates));
    } else {
      setCandidates([]);
      setError('No candidates');
      console.log('No candidates in localStorage', error);
    }
  };

  fetchCandidates();
}, []);

useEffect(() => {
  if (candidates.length === 0) {
    setError('No candidates available');
  } else {
    setError(null);
  }
}, [candidates]); 

const handleReject = (login: string) => {
  const updatedCandidates = candidates.filter(candidate => candidate.login !== login);
  setCandidates(updatedCandidates);
  localStorage.setItem('candidates', JSON.stringify(updatedCandidates));
};

  return (
    <section>
      <h1 className="text-center m-5 display-4">Potential Candidates</h1>
      <div className="text-center mb-5">
        <label className="form-label text-light">Sort by:</label>
        <select 
          className="form-select w-auto mx-auto mb-3"
          value={sortCriteria} 
          onChange={(e) => setSortCriteria(e.target.value)}
        >
          <option value="">Select</option>
          <option value="name">Name</option>
          <option value="location">Location</option>
          <option value="company">Company</option>
        </select>

        <label className="form-label">Filter by name or location:</label>
        <input 
          type="text"
          className="form-control w-auto mx-auto"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          placeholder="Enter name or location"
        />
      </div>

      {error ? (
        <p style={{ color: 'red', textAlign: 'center' }} className="mt-4">{error}</p>
      ) : (
        <table className="table table-dark table-hover table-striped" style={{ margin: '0 auto 5% auto', width: '80%' }}>
          <thead>
        <tr className="text-center">
          <th>Image</th>
          <th>Name</th>
          <th>Location</th>
          <th>Email</th>
          <th>Company</th>
          <th>Profile</th>
          <th>Bio</th>
          <th>Reject</th>
        </tr>
        </thead>
        <tbody>
          {candidates
            .filter(candidate =>
            (candidate.name ?? '').toLowerCase().includes(filterText.toLowerCase()) ||
            (candidate.location ?? '').toLowerCase().includes(filterText.toLowerCase())
            )
            .sort((a, b) => {
              if (sortCriteria === 'name')
                return (a.name ?? '').localeCompare(b.name as string);
              if (sortCriteria === 'location')
                return (a.location ?? '').localeCompare(b.location as string);
              if (sortCriteria === 'company')
                return (a.company ?? '').localeCompare(b.company as string);
              return 0;
            })
            .map((candidate) => (
              <tr className="align-middle" key={candidate.login} style={{ wordWrap: 'break-word' }}>
                <td className="text-center"><img src={candidate.avatar_url as string} alt={candidate.name as string} style={{width: '100px', height: '100px', borderRadius: '10%' }}/></td>
                <td>
                <span className="fw-bold">{candidate.name}</span> 
                <span className="fw-bold fst-italic"> ({candidate.login})</span> 
                </td>
                <td>{candidate.location}</td>
                <td>{candidate.email}</td>
                <td>{candidate.company}</td>
                <td><a href={candidate.html_url as string} target="_blank" rel="noopener noreferrer">{candidate.html_url}</a></td>
                <td>{candidate.bio}</td>
                <td className="text-center"><button 
                  className="btn rounded-circle btn-lg btn-danger text-dark fw-bold"
                  onClick={() => handleReject(candidate.login as string)}
                  >
                    –
                    </button>
                  </td>
              </tr>
          ))}
        </tbody>
        </table>
      )}
    </section>
  );
};

export default SavedCandidates;
