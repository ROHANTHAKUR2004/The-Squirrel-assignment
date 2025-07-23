import DoctorForm from './components/DoctorForm';
import PatientSearch from './components/PatientSearch';

export default function App() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Doctor-Patient Platform</h1>
      <DoctorForm />
      <hr />
     <PatientSearch />
    </div>
  );
}
