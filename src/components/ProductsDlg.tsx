import React, { useActionState, useOptimistic, useState } from "react";
import Modal from "../common/Modal";

import type { Product } from "../data/productsData";

interface ProductModalProps {
  onSave: (product: Product) => void;
  onClose: () => void;
  formData: Product;
  editMode: boolean;
  skuList: any;
}

export default function ProductModal({
  onSave,
  onClose,
  formData,
  editMode,
  skuList,
}: ProductModalProps) {
  const [form, setForm] = useState<Product>(formData);
  const [errors, setErrors] = useState<Partial<Record<keyof Product, string>>>(
    {}
  );

  const lable: String = editMode ? "Edit" : "Add";

  const validate = () => {
      
      
    const errs: Partial<Record<keyof Product, string>> = {};

    if (!form.name.trim()) errs.name = "Name is required";

    if (!form.sku.trim()) errs.sku = "SKU is required";
    else if (!editMode && skuList.includes(form.sku))
      errs.sku = "SKU should be unique";

    if (form.price === 0 || Number(form.price) <= 0)
      errs.price = "Price must be greater than 0";

    if (form.quantity === 0 || Number(form.quantity) < 0)
      errs.quantity = "Quantity must be 0 or more";

    if (!form.category.trim()) errs.category = "Category is required";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        name === "price" || name === "quantity"
          ? value === ""
            ? ""
            : Number(value)
          : value,
    }));
  };

  const handleSubmit = async () => {
      if (!validate()) return;
      
      return { success: true };
    
  };
  const [_, action, pending] = useActionState(handleSubmit, { success: false });
  return (
    <Modal>
      <h2>{lable} Product</h2>

      <form action={action}>
        <div className="form-wrapper">
          <div>
            <label>Name</label>
            <br></br>
            <input name="name" value={form.name} onChange={handleChange} />
            {errors.name && <small className="error">{errors.name}</small>}
          </div>
          <div>
            <label>SKU</label>
            <br></br>
            <input name="sku" value={form.sku} onChange={handleChange} />
            <br></br>
            {errors.sku && <small className="error">{errors.sku}</small>}
          </div>
          <div>
            <label>Price:</label>
            <br></br>
            <input
              name="price"
              type="number"
              step="0.01"
              value={form.price}
              onChange={handleChange}
            />
            <br></br>
            {errors.price && <small className="error">{errors.price}</small>}
          </div>
          <div>
            <label>Quantity</label>
            <br></br>
            <input
              name="quantity"
              type="number"
              value={form.quantity}
              onChange={handleChange}
            />
            <br></br>
            {errors.quantity && (
              <small className="error">{errors.quantity}</small>
            )}
          </div>
          <div>
            <label>Category</label>
            <br></br>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
            >
              <option value="">Select category</option>
              <option value="electronics">electronics</option>
              <option value="clothes">furniture</option>
              <option value="stationery">stationery</option>
            </select>
            <br></br>
            {errors.category && (
              <small className="error">{errors.category}</small>
            )}
          </div>
        </div>
        <div className="form-btn-wrapper">
          <button className="close-btn" onClick={onClose}>
            Close
          </button>
          <button type="submit" className="btn-save">
            {pending ? "Pending" : "Save"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
