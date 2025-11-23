import Navbar from '../components/Navbar';

export default function Index() {
  return (
    <div>
      <Navbar />
      <main style={{ minHeight: 'calc(100vh - 70px)' }} />
    </div>
  );
}
