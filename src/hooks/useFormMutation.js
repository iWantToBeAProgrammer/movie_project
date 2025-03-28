// hooks/useWatchlistMutation.js
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useWatchlistMutation = ({
  initialData,
  mutationFn,
  queryKey,
  modalId,
}) => {
  const [formData, setFormData] = useState(initialData);
  const queryClient = useQueryClient();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, picture: file }));
  };

  const { mutate, isLoading } = useMutation({
    mutationFn,
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries([queryKey]);
      setFormData(initialData);
      if (modalId) {
        document.getElementById(modalId).close();
      }
    },
    onError: (error) => {
      toast.error(error.message || `Failed to perform ${queryKey} operation`);
    },
  });

  const handleSubmit = (e, tmdbId = null) => {
    if (e) e.preventDefault();

    mutate({
      ...formData,
      ...(tmdbId && { tmdbId }), // Conditionally add tmdbId only if provided
    });
  };

  const handleSubmitWithId = (
    id,
    idFieldName = "watchlistId",
    additionalData = {}
  ) => {
    mutate({ ...formData, [idFieldName]: id, ...additionalData });
  };

  return {
    formData,
    setFormData,
    handleChange,
    handleImageChange,
    handleSubmit,
    handleSubmitWithId,
    isLoading,
    mutate,
  };
};
