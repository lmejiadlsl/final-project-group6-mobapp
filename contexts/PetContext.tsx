import React, { createContext, useContext, useState } from 'react';

// Types
export type Pet = {
  id: string;
  name: string;
  breed: string;
  age: string;
  description: string;
  type: string;
  location: string;
  images: string[];
  available: boolean;
  size?: string;
  gender?: string;
  vaccinated?: boolean;
  neutered?: boolean;
  shelter?: string;
};

export type AdoptionApplication = {
  id: string;
  petId?: string;
  petName?: string;
  applicantName?: string;
  email?: string;
  phone?: string;
  address?: string;
  experience?: string;
  livingSituation?: 'house' | 'apartment' | 'other';
  hasYard?: boolean;
  otherPets?: string;
  reasonForAdoption?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  pet?: Pet;
  user?: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
};

// Context
const PetContext = createContext<{
  pets: Pet[];
  setPets: React.Dispatch<React.SetStateAction<Pet[]>>;
  applications: AdoptionApplication[];
  setApplications: React.Dispatch<React.SetStateAction<AdoptionApplication[]>>;
}>({
  pets: [],
  setPets: () => {},
  applications: [],
  setApplications: () => {},
});

// Provider Component
export const PetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [applications, setApplications] = useState<AdoptionApplication[]>([]);

  return (
    <PetContext.Provider value={{ pets, setPets, applications, setApplications }}>
      {children}
    </PetContext.Provider>
  );
};

// Custom hook
export const usePetContext = () => {
  const context = useContext(PetContext);
  if (!context) {
    throw new Error('usePetContext must be used within a PetProvider');
  }
  return context;
};