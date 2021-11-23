import { useEffect, useState } from "react";

import { Header } from "../../components/Header";
import { Food, FoodType } from "../../components/Food";
import { ModalAddFood } from "../../components/ModalAddFood";
import { ModalEditFood } from "../../components/ModalEditFood";

import { api } from "../../services/api";

import { FoodsContainer } from "./styles";

export const Dashboard = () => {
  const [foods, setFoods] = useState<FoodType[]>([]);
  const [editingFood, setEditingFood] = useState<FoodType>({} as FoodType);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const handleAddFood = async (food: FoodType) => {
    try {
      const response = await api.post<FoodType>("/foods", {
        ...food,
        available: true,
      });

      setFoods((prev) => [...prev, response.data]);
    } catch (e) {
      console.log(e);
    }
  };

  const handleUpdateFood = async (food: FoodType) => {
    try {
      const response = await api.put<FoodType>(`/foods/${editingFood.id}`, {
        ...editingFood,
        ...food,
      });

      setFoods((prev) => [...prev, response.data]);
    } catch (e) {
      console.log(e);
    }
  };

  const handleDeleteFood = async (id: number) => {
    try {
      await api.delete(`/foods/${id}`);
      setFoods((prev) => prev.filter((food) => food.id !== id));
    } catch (e) {
      console.log(e);
    }
  };

  const toggleModal = () => setModalOpen(!modalOpen);
  const toggleEditModal = () => setEditModalOpen(!editModalOpen);

  const handleEditFood = (food: FoodType) => {
    setEditingFood(food);
    setEditModalOpen(true);
  };

  useEffect(() => {
    const fetchFoods = async () => {
      const response = await api.get("/foods");
      setFoods(response.data);
    };

    fetchFoods();
  }, []);

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map((food) => (
            <Food
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  );
};
