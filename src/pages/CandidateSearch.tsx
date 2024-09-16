import { useState, useEffect } from 'react';
import { searchGithub, searchGithubUser } from '../api/API';
import Candidate from '../interfaces/Candidate.interface';

const CandidateSearch = () => {
  const [currentCandidate, setCurrentCandidate] = useState<Candidate>({
    name: '',
    login: '',
    location: '',
    avatar_url: '',
    email: '',
    html_url: '',
    company: '',
    bio: '',
});

const [candidates, setCandidates] = useState<Candidate[]>([]);

const [currentIndex, setCurrentIndex] = useState<number>(0);

const [searchInput, setSearchInput] = useState<string>('');

const [error, setError] = useState<string | null>(null);

const [noMoreCandidates, setNoMoreCandidates] = useState<boolean>(false);

useEffect(() => {
  const fetchCandidates = async () => {
    try {
      const data = await searchGithub();
      const fetchedCandidates: Candidate[] = data.map((user: Candidate) => ({
        name: user.name || 'No name available',
        login: user.login,
        location: user.location || 'No location available',
        avatar_url: user.avatar_url || 'No avatar available',
        email: user.email || 'No email available',
        html_url: user.html_url || 'No address available',
        company: user.company || 'No company available',
        bio: user.bio || 'No bio available',
      }));
      setCandidates(fetchedCandidates);
      console.log(candidates);
      if (fetchedCandidates.length > 0) {
        setCurrentCandidate(fetchedCandidates[0]);
      }
      setError(null); 
  } catch (error) {
    setError('Error fetching candidates');
  }
};

fetchCandidates();
}, []);

const handleSearch = async () => {
  try {
    const userData = await searchGithubUser(searchInput);

    if (Object.keys(userData).length === 0) {
      setError('User not found');
      setCurrentCandidate({
        name: '',
        login: '',
        location: '',
        avatar_url: '',
        email: '',
        html_url: '',
        company: '',
        bio: '',
      });
    } else {
      const fetchedCandidates: Candidate = {
        name: userData.name || 'No name available',
        login: userData.login,
        location: userData.location || 'No location available',
        avatar_url: userData.avatar_url || 'No avatar available',
        email: userData.email || 'No email available',
        html_url: userData.html_url || 'No address available',
        company: userData.company || 'No company available',
        bio: userData.bio || 'No bio available',
      };
      setCurrentCandidate(fetchedCandidates);
      setError(null);
    }
    setSearchInput(''); 
  } catch (err) {
    setError('An error occurred while fetching user data');
  }
};

const moveToNext = () => {

  if (noMoreCandidates) {
    setError('No more candidates');
    return;
  }

  if (candidates.length === 0) {
    setError('No candidates available.');
    return;
  }
  
  if (currentIndex + 1 < candidates.length) {
    const nextIndex = currentIndex +1;
    setCurrentCandidate(candidates[nextIndex]);
    setCurrentIndex(nextIndex);
  } else {
    setNoMoreCandidates(true);
  }
}

const saveCandidate = () => {

  if (noMoreCandidates) {
    setError('No more candidates');
    return;
  }

  if (candidates.length === 0) {
    setError('No candidates available.');
    return;
  }
 
  console.log('Saving candidate:', currentCandidate);
  let parsedCandidates: Candidate[] = [];
  const storedCandidates = localStorage.getItem('candidates');
  if (typeof storedCandidates === 'string') {
    parsedCandidates = JSON.parse(storedCandidates);
  }
  parsedCandidates.push(currentCandidate);
  localStorage.setItem('candidates', JSON.stringify(parsedCandidates));
  console.log('Candidates in localStorage:', JSON.parse(localStorage. getItem('candidates') as string));

  moveToNext();
};


return (
  <section className="container mt-5">
    <h1 className="text-center mb-5 display-4">Candidate Search</h1>

    <div className="container mb-5">
      <div className="form">
        <div className="dol-12 d-flex justify-content-center">
      <input
        type="text"
        placeholder="Search GitHub User"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        />
        <button className="btn btn-primary" onClick={handleSearch}>Search</button>
        </div>
      </div>
    </div>

      {error && <p style={{ color: 'red', textAlign: 'center' }} className="mt-4">{error}</p>}

      {currentCandidate && (
        <div className="container-fluid p-0 mb-4" style={{ wordWrap: 'break-word' }}>
          <div className="row no-gutters justify-content-center">
            <div className="col-12 col-md-8 col-lg-3 p-0">
              <div 
                className="bg-dark text-white p-0"
                style={{ borderRadius: '1.5rem' }} 
              >
                <img 
                  src={currentCandidate.avatar_url as string} 
                  alt="Avatar" 
                  className="img-fluid w-90"
                  style={{ 
                    objectFit: 'cover', 
                    borderRadius: '1.5rem 1.5rem 0 0' 
                  }} 
                />
                <div className="card-body p-3">
                  <h2 className="card-title mb-3">{`${currentCandidate.name} (${currentCandidate.login})`}</h2>
                  <p className="card-text mb-3">Location: {currentCandidate.location}</p>
                  <p className="card-text mb-3">Email: {currentCandidate.email}</p>
                  <p className="card-text mb-4">Company: {currentCandidate.company}</p>
                  <p className="card-text mb-3">GitHub URL: <a href={currentCandidate.html_url as string} target="_blank" rel="noopener noreferrer" className="text-white">{currentCandidate.html_url}</a></p>
                  <p className="card-text mb-2">Bio: {currentCandidate.bio}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      )}

      <div className="d-flex justify-content-center gap-5 mb-5">
        <button
          className="btn btn-danger btn-sm rounded-circle text-dark"
          style={{ width: '80px', height: '80px', fontSize: '2rem' }}
          onClick={moveToNext}
        >
          –
        </button>

        <button
          className="btn btn-success btn-sm rounded-circle text-dark"
          style={{ width: '80px', height: '80px', fontSize: '2rem' }}
          onClick={saveCandidate}
        >
          +
        </button>
      </div>
  </section>
);
}

export default CandidateSearch;