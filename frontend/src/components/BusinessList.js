import React, { useEffect, useState } from "react";
import Api from "../api";
import { Table, Pagination, Form, Button, Modal, Toast } from "react-bootstrap";
import BusinessForm from "./BusinessForm";

const BusinessList = () => {
  const [businesses, setBusinesses] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [businessToDelete, setBusinessToDelete] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [showBusinessForm, setShowBusinessForm] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [error, setError] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    fetchBusinesses();
  }, [pageNumber, pageSize, keyword, sortBy, sortOrder]);

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const fetchBusinesses = async () => {
    try {
      const response = await Api.get('/Businesses/', {
        params: {
          pageNumber,
          pageSize,
          keyword,
          sortBy,
          sortOrder,
        },
      });
      setBusinesses(response.data.data);
      setTotalRecords(response.data.totalRecords);
    } catch (error) {
      setError('Failed to fetch businesses. Please try again.');
      console.error('Error fetching businesses:', error);
    }
  };

  const handleAddBusiness = () => {
    setSelectedBusiness(null);
    setShowBusinessForm(true);
  };

  const handleEditBusiness = (business) => {
    console.log("inside the handle edit business",business);
    setSelectedBusiness(business);
    setShowBusinessForm(true);
  };

  const handleSaveBusiness = async (formData) => {
    try {
      if (selectedBusiness) {
        // Update existing business
        formData.businessId = selectedBusiness.businessId;
        await Api.put(`/Businesses/${selectedBusiness.businessId}`, formData);
        setToastMessage("Business updated successfully.");
      } else {
        // Add new business
        await Api.post("/Businesses", formData);
        setToastMessage("Business added successfully.");
      }
      fetchBusinesses();
      setShowBusinessForm(false);
      setShowToast(true);
    } catch (error) {
      console.error("Error saving business:", error);
      setError("failed to save business");
    }
  };

  const deleteBusiness = async () => {
    try {
      await Api.delete(`/Businesses/${businessToDelete}`);
      const updatedBusinesses = businesses.filter(
        (business) => business.businessId !== businessToDelete
      );
      setBusinesses(updatedBusinesses);
      setToastMessage("Business deleted successfully.");
      setShowToast(true);
    } catch (error) {
      setError("failed to delete business");
    } finally {
      setShowDeleteModal(false);
      setBusinessToDelete(null);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchBusinesses();
  };

  return (
    <div>
      <h1>Business List</h1>
      <Button variant="primary" onClick={handleAddBusiness} className="mb-3">
        Add New Business
      </Button>

      <Form onSubmit={handleSearch} className="mb-3">
        <Form.Control
          type="text"
          placeholder="Search by name or city"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <Button type="submit" variant="primary" className="mt-2">
          Search
        </Button>
      </Form>
      <div style={{ overflowX: 'auto' }}>
      <Table striped bordered hover>
      <thead>
  <tr>
    <th onClick={() => handleSort('name')}>
      Name {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
    </th>
    <th>Category</th>
    <th>Street address</th>
    <th onClick={() => handleSort('city')}>
    City {sortBy === 'city' && (sortOrder === 'asc' ? '↑' : '↓')}
    </th>
    <th>State/Zip</th>
    <th>Phone</th>
    <th>Website</th>
    <th>Rating</th>
    <th>Actions</th>
  </tr>
</thead>
        <tbody>
          {businesses.map((business) => (
            <tr key={business.businessId}>
              <td style={{ display: "none" }}>{business.businessId}</td>
              <td>{business.name}</td>
              <td>{business.category?.name}</td>
              <td>{business.address}</td>
              <td>{business.city}</td>
              <td>{`${business.state}/${business.zipCode}`}</td>
              <td>{business.phoneNumber}</td>
              <td>
                <a
                  href={business.website}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {business.website}
                </a>
              </td>
              <td>{business.rating}</td>
              <td>
                <Button
                  variant="warning"
                  size="sm"
                  className="me-2"
                  onClick={() => handleEditBusiness(business)}
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => {
                    setBusinessToDelete(business.businessId);
                    setShowDeleteModal(true);
                  }}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      </div>
      <Form.Group className="mb-3">
        <Form.Label>Records per page:</Form.Label>
        <Form.Select
          value={pageSize}
          onChange={(e) => setPageSize(Number(e.target.value))}
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </Form.Select>
      </Form.Group>
      <Pagination>
        <Pagination.Prev
          onClick={() => setPageNumber((prev) => Math.max(prev - 1, 1))}
          disabled={pageNumber === 1}
        />
        {Array.from({ length: Math.ceil(totalRecords / pageSize) }, (_, i) => (
          <Pagination.Item
            key={i + 1}
            active={i + 1 === pageNumber}
            onClick={() => setPageNumber(i + 1)}
          >
            {i + 1}
          </Pagination.Item>
        ))}
        <Pagination.Next
          onClick={() => setPageNumber((prev) => prev + 1)}
          disabled={pageNumber === Math.ceil(totalRecords / pageSize)}
        />
      </Pagination>

      {/* Add/Edit Business Modal */}
      <BusinessForm
        show={showBusinessForm}
        onHide={() => setShowBusinessForm(false)}
        business={selectedBusiness}
        onSubmit={handleSaveBusiness}
      />

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this business?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={deleteBusiness}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Success Toast */}
      <Toast
        show={showToast}
        onClose={() => setShowToast(false)}
        delay={3000}
        autohide
        style={{
          position: "fixed",
          top: "20px",
          right: "20px",
        }}
      >
        <Toast.Header>
          <strong className="me-auto">Success</strong>
        </Toast.Header>
        <Toast.Body>{toastMessage}</Toast.Body>
      </Toast>

      <Toast
  show={!!error}
  onClose={() => setError(null)}
  delay={3000}
  autohide
  style={{
    position: 'fixed',
    top: '20px',
    left: '20px',
    backgroundColor: '#dc3545',
    color: '#fff',
  }}
>
  <Toast.Header>
    <strong className="me-auto">Error</strong>
  </Toast.Header>
  <Toast.Body>{error}</Toast.Body>
</Toast>
    </div>
  );
};

export default BusinessList;
