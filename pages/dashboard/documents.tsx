import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { Card, Loading } from '../../components/ui';
import Sidebar from '../../components/layout/Sidebar';
import { ProtectedRoute } from '../../components/auth';
import {
  Search,
  Filter,
  FileText,
  Calendar,
  User,
  Download,
  Eye,
  Edit,
  Trash2,
  Plus,
  Menu
} from 'lucide-react';

interface Document {
  id: string;
  title: string;
  description: string;
  type: string;
  category: string;
  author: string;
  authorId: number;
  createdDate: string;
  lastModified: string;
  size: string;
  tags: string[];
  status: string;
}

interface DocumentsData {
  documents: Document[];
  summary: {
    totalDocuments: number;
    byCategory: Record<string, number>;
    byType: Record<string, number>;
    byStatus: Record<string, number>;
  };
  settings: {
    categories: string[];
    types: string[];
    statuses: string[];
  };
}

export default function DocumentsPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await fetch('/data/documents.json');
      const data: DocumentsData = await response.json();
      setDocuments(data.documents);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching documents:', error);
      setLoading(false);
    }
  };

  // Filter documents based on search and filters
  const filteredDocuments = documents.filter(document => {
    const matchesSearch = document.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         document.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         document.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = categoryFilter === 'all' || document.category === categoryFilter;
    const matchesType = typeFilter === 'all' || document.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || document.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesType && matchesStatus;
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentDocuments = filteredDocuments.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredDocuments.length / itemsPerPage);

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Reset filters
  const resetFilters = () => {
    setSearchTerm('');
    setCategoryFilter('all');
    setTypeFilter('all');
    setStatusFilter('all');
    setCurrentPage(1);
  };

  // Get unique categories, types, and statuses for filter dropdowns
  const uniqueCategories = Array.from(new Set(documents.map(doc => doc.category)));
  const uniqueTypes = Array.from(new Set(documents.map(doc => doc.type)));
  const uniqueStatuses = Array.from(new Set(documents.map(doc => doc.status)));

  if (loading) {
    return (
      <ProtectedRoute>
        <Loading message="Loading documents..." />
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <Head>
        <title>Documents - School Management System</title>
        <meta name="description" content="Manage school documents in the school management system" />
      </Head>
      <div className="dashboard-layout">
        <div className="dashboard-sidebar">
          <Sidebar
            activeItem="document"
            isMobileOpen={isMobileMenuOpen}
            setIsMobileOpen={setIsMobileMenuOpen}
          />
        </div>
        <div className="dashboard-main">
          <div className="main-content">
            <div className="container-fluid p-0">
              {/* Mobile Hamburger Button */}
              <button
                className="mobile-hamburger d-block d-md-none"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle mobile menu"
              >
                <Menu size={24} />
              </button>

              {/* Header Section */}
              <div className="dashboard-header mb-4">
                <div className="row align-items-center">
                  <div className="col-12">
                    <h1 className="dashboard-title mb-2">Document Management</h1>
                    <p className="dashboard-subtitle mb-0">
                      Upload, organize, and share documents with students and staff
                    </p>
                  </div>
                </div>
              </div>

              {/* Filters */}
              <div className="row mb-4">
                <div className="col-12">
                  <Card title="" className="filter-card">
                    <div className="row g-3 align-items-center">
                      <div className="col-12 col-lg-5">
                        <div className="input-group">
                          <span className="input-group-text bg-light">
                            <Search size={16} className="text-muted" />
                          </span>
                          <input
                            type="text"
                            className="form-control task-search-input"
                            placeholder="Search documents..."
                            value={searchTerm}
                            onChange={(e) => {
                              setSearchTerm(e.target.value);
                              setCurrentPage(1);
                            }}
                          />
                        </div>
                      </div>
                      <div className="col-6 col-md-4 col-lg-2">
                        <select
                          className="form-select"
                          value={categoryFilter}
                          onChange={(e) => {
                            setCategoryFilter(e.target.value);
                            setCurrentPage(1);
                          }}
                        >
                          <option value="all">All Categories</option>
                          {uniqueCategories.map(category => (
                            <option key={category} value={category}>{category}</option>
                          ))}
                        </select>
                      </div>
                      <div className="col-6 col-md-4 col-lg-2">
                        <select
                          className="form-select"
                          value={typeFilter}
                          onChange={(e) => {
                            setTypeFilter(e.target.value);
                            setCurrentPage(1);
                          }}
                        >
                          <option value="all">All Types</option>
                          {uniqueTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </select>
                      </div>
                      <div className="col-6 col-md-4 col-lg-2">
                        <select
                          className="form-select"
                          value={statusFilter}
                          onChange={(e) => {
                            setStatusFilter(e.target.value);
                            setCurrentPage(1);
                          }}
                        >
                          <option value="all">All Statuses</option>
                          {uniqueStatuses.map(status => (
                            <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>
                          ))}
                        </select>
                      </div>
                      <div className="col-6 col-md-4 col-lg-1">
                        <button
                          className="btn btn-outline-secondary w-100"
                          onClick={resetFilters}
                        >
                          <Filter size={16} />
                          <span className="d-none d-md-inline ms-1">Reset</span>
                        </button>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>

              {/* Action Bar */}
              <div className="row mb-3">
                <div className="col-12">
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center">
                      <h5 className="mb-0 text-muted">Documents</h5>
                      <span className="badge bg-light text-dark ms-3">
                        {filteredDocuments.length} of {documents.length} documents
                      </span>
                    </div>
                    <button className="btn btn-primary btn-sm">
                      <Plus size={16} className="me-1" />
                      Upload Document
                    </button>
                  </div>
                </div>
              </div>

              {/* Documents Table */}
              <div className="row">
                <div className="col-12">
                  <div className="card">
                    <div className="card-body p-0">
                      <div className="table-responsive">
                        <table className="table table-hover mb-0">
                          <thead className="table-light">
                            <tr>
                              <th scope="col" className="border-0">Document</th>
                              <th scope="col" className="border-0">Category</th>
                              <th scope="col" className="border-0">Type</th>
                              <th scope="col" className="border-0">Author</th>
                              <th scope="col" className="border-0">Date</th>
                              <th scope="col" className="border-0">Size</th>
                              <th scope="col" className="border-0">Status</th>
                              <th scope="col" className="border-0 text-end">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {currentDocuments.length > 0 ? (
                              currentDocuments.map((document) => (
                                <tr key={document.id} className="align-middle">
                                  <td className="border-0">
                                    <div className="d-flex align-items-center">
                                      <div className="me-3">
                                        <div className="bg-light rounded p-2">
                                          <FileText size={20} className="text-primary" />
                                        </div>
                                      </div>
                                      <div>
                                        <h6 className="mb-0">{document.title}</h6>
                                        <p className="text-muted mb-0 small">{document.description}</p>
                                        <div className="mt-1">
                                          {document.tags.map((tag, index) => (
                                            <span key={index} className="badge bg-light text-dark me-1 small">
                                              {tag}
                                            </span>
                                          ))}
                                        </div>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="border-0">
                                    <span className="badge bg-secondary">{document.category}</span>
                                  </td>
                                  <td className="border-0">
                                    <span className="badge bg-info">{document.type}</span>
                                  </td>
                                  <td className="border-0">{document.author}</td>
                                  <td className="border-0">
                                    <div className="d-flex align-items-center">
                                      <Calendar size={14} className="me-1 text-muted" />
                                      <span>{new Date(document.lastModified).toLocaleDateString()}</span>
                                    </div>
                                  </td>
                                  <td className="border-0">{document.size}</td>
                                  <td className="border-0">
                                    <span className={`badge ${
                                      document.status === 'published' ? 'bg-success' : 'bg-warning'
                                    }`}>
                                      {document.status}
                                    </span>
                                  </td>
                                  <td className="border-0 text-end">
                                    <div className="btn-group" role="group">
                                      <button className="btn btn-sm btn-outline-primary">
                                        <Eye size={14} />
                                      </button>
                                      <button className="btn btn-sm btn-outline-secondary">
                                        <Edit size={14} />
                                      </button>
                                      <button className="btn btn-sm btn-outline-danger">
                                        <Trash2 size={14} />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan={8} className="text-center py-5">
                                  <FileText size={48} className="text-muted mb-3" />
                                  <h5>No documents found</h5>
                                  <p className="text-muted">
                                    {searchTerm || categoryFilter !== 'all' || typeFilter !== 'all' || statusFilter !== 'all'
                                      ? 'Try adjusting your filters or search term'
                                      : 'No documents have been uploaded yet'}
                                  </p>
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="row mt-4">
                  <div className="col-12">
                    <nav aria-label="Documents pagination">
                      <ul className="pagination justify-content-center">
                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                          <button 
                            className="page-link" 
                            onClick={() => paginate(currentPage - 1)}
                            disabled={currentPage === 1}
                          >
                            Previous
                          </button>
                        </li>
                        
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                          <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
                            <button 
                              className="page-link" 
                              onClick={() => paginate(number)}
                            >
                              {number}
                            </button>
                          </li>
                        ))}
                        
                        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                          <button 
                            className="page-link" 
                            onClick={() => paginate(currentPage + 1)}
                            disabled={currentPage === totalPages}
                          >
                            Next
                          </button>
                        </li>
                      </ul>
                    </nav>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}