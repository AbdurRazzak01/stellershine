import React, { useState } from 'react';

const KYCForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [governmentId, setGovernmentId] = useState('');
  const [nationality, setNationality] = useState('');
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    
    // Simulate a submission without sending data anywhere
    alert(`KYC Submitted!
    Name: ${name}
    Email: ${email}
    Phone: ${phone}
    Address: ${address}
    Government ID: ${governmentId}
    Nationality: ${nationality}
    File: ${file?.name}`);
    
    // Reset form fields
    setName('');
    setEmail('');
    setPhone('');
    setAddress('');
    setGovernmentId('');
    setNationality('');
    setFile(null);
  };

  return (
    <div className="kyc-form-container">
      <h1>KYC Form</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Full Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone">Phone Number:</label>
          <input
            type="tel"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="address">Address:</label>
          <input
            type="text"
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </div>


        <div className="form-group">
          <label htmlFor="nationality">Nationality:</label>
          <input
            type="text"
            id="nationality"
            value={nationality}
            onChange={(e) => setNationality(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="file">Upload Your Government ID:</label>
          <input
            type="file"
            id="file"
            accept="image/*,application/pdf"
            onChange={handleFileChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="file">Upload Address Proof:</label>
          <input
            type="file"
            id="file"
            accept="image/*,application/pdf"
            onChange={handleFileChange}
            required
          />
        </div>

        <button type="submit">Submit KYC</button>
      </form>
    </div>
  );
};

export default KYCForm;
