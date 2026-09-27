import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { AdminDashboard } from '../components/AdminDashboard';
import { BrandLoadingScreen } from '../components/BrandLoadingScreen';

export const AdminPage: React.FC = () => {
  const { products, setProducts } = useCart();
  const { user, loading, isAdmin } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return <BrandLoadingScreen message="Verifying admin credentials..." />;
  }

  if (!user || !isAdmin) {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <AdminDashboard
        isOpen={true}
        onClose={() => navigate('/')}
        products={products}
        onUpdateProducts={setProducts}
      />
    </div>
  );
};
