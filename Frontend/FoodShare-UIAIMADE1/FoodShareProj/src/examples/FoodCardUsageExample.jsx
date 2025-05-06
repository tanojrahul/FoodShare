import React, { useState, useEffect } from 'react';
import FoodCard from '../components/FoodCard';

const FoodCardUsageExample = () => {
  const [foodItems, setFoodItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate fetching data from an API
  useEffect(() => {
    // In a real app, you would fetch data from your API
    const fetchData = async () => {
      try {
        // Simulating API delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Mock data
        const mockFoodItems = [
          {
            id: '1',
            title: 'Fresh Vegetables',
            type: 'Vegetables',
            quantity: '5',
            unit: 'kg',
            expiresAt: '2023-06-15',
            status: 'Pending',
            imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?ixlib=rb-4.0.3',
            location: '123 Main St, City'
          },
          {
            id: '2',
            title: 'Rice Bags',
            type: 'Grains',
            quantity: '10',
            unit: 'bags',
            expiresAt: '2024-01-20',
            status: 'In Transit',
            imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?ixlib=rb-4.0.3',
            location: '456 Oak Ave, Town'
          },
          {
            id: '3',
            title: 'Canned Soup',
            type: 'Canned Goods',
            quantity: '24',
            unit: 'cans',
            expiresAt: '2023-12-30',
            status: 'Completed',
            imageUrl: 'https://images.unsplash.com/photo-1534483509719-3feaee7c30da?ixlib=rb-4.0.3',
            location: '789 Elm St, Village'
          },
          {
            id: '4',
            title: 'Fresh Bread',
            type: 'Bakery',
            quantity: '8',
            unit: 'loaves',
            expiresAt: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
            status: 'Pending',
            imageUrl: 'https://images.unsplash.com/photo-1608198093002-ad4e005484ec?ixlib=rb-4.0.3',
            location: '101 Pine Rd, City'
          }
        ];
        
        setFoodItems(mockFoodItems);
      } catch (error) {
        console.error('Error fetching food items:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCardClick = (id) => {
    console.log(`Card with ID ${id} was clicked`);
    // In a real app, you might navigate to a details page
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-[#123458] mb-6">Available Food Donations</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {/* Display skeleton loaders when loading */}
        {isLoading && 
          Array(4).fill().map((_, index) => (
            <FoodCard key={`skeleton-${index}`} isLoading={true} />
          ))
        }
        
        {/* Display actual food cards when data is loaded */}
        {!isLoading && foodItems.map(foodItem => (
          <FoodCard 
            key={foodItem.id} 
            food={foodItem} 
            onClick={() => handleCardClick(foodItem.id)} 
          />
        ))}
      </div>
    </div>
  );
};

export default FoodCardUsageExample;
