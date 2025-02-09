import React, { useState, useEffect } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import api from "../api";

const BusinessForm = ({ show, onHide, business, onSubmit }) => {
  const [formData, setFormData] = useState({
    businessId: null,
    name: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    phoneNumber: "",
    website: "",
    rating: 0,
    categoryId: null,
  });
  const categories = [
    { categoryId: 1, name: "Restaurants" },
    { categoryId: 2, name: "Electronics" },
    { categoryId: 3, name: "Healthcare" },
    { categoryId: 4, name: "Education" },
    { categoryId: 5, name: "Other" },
  ];

  useEffect(() => {
    if (business) {
      setFormData({
        businessId: business.businessId,
        name: business.name,
        address: business.address,
        city: business.city,
        state: business.state,
        zipCode: business.zipCode,
        phoneNumber: business.phoneNumber,
        website: business.website,
        rating: business.rating,
        categoryId: business.categoryId,
      });
    } else {
      setFormData({
        name: "",
        address: "",
        city: "",
        state: "",
        zipCode: "",
        phoneNumber: "",
        website: "",
        rating: 0,
        categoryId: null,
      });
    }
  }, [business]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>
          {business ? "Edit Business" : "Add New Business"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
  <Form.Label>Address</Form.Label>
  <Form.Control
    as="textarea"
    name="address"
    value={formData.address}
    onChange={handleChange}
    rows={3}
  />
</Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>City</Form.Label>
            <Form.Control
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>State</Form.Label>
            <Form.Control
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Zip Code</Form.Label>
            <Form.Control
              type="text"
              name="zipCode"
              value={formData.zipCode}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Phone Number</Form.Label>
            <Form.Control
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              minLength={10}
              maxLength={10}
              required
            />
            {/* Validation message */}
  {formData.phoneNumber && formData.phoneNumber.length !== 10 && (
    <Form.Text className="text-danger">
      Phone number must be exactly 10 characters.
    </Form.Text>
  )}
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Website</Form.Label>
            <Form.Control
              type="url"
              name="website"
              value={formData.website}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Rating</Form.Label>
            <Form.Control
              type="number"
              name="rating"
              value={formData.rating}
              onChange={handleChange}
              min="0"
              max="5"
              step="0.1"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Category</Form.Label>
            <Form.Control
              as="select"
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
            >
              <option value={null}>Select Category</option>
              {categories.map((category) => (
                <option key={category.categoryId} value={category.categoryId}>
                  {category.name}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Button variant="primary" type="submit">
            Save
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default BusinessForm;
