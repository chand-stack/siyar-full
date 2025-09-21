import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import { 
  useGetAllContactsQuery, 
  useGetContactStatsQuery,
  useUpdateContactStatusMutation,
  useDeleteContactMutation,
  type Contact 
} from '../../../../Redux/api/contactApi';

const ContactManagement: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [showModal, setShowModal] = useState(false);
  const limit = 10;

  // API hooks
  const { data: statsData, isLoading: statsLoading } = useGetContactStatsQuery();
  const { data: contactsData, isLoading: contactsLoading, refetch } = useGetAllContactsQuery({
    page: currentPage,
    limit,
    status: statusFilter || undefined,
    search: searchQuery || undefined
  });
  const [updateContactStatus, { isLoading: updateLoading }] = useUpdateContactStatusMutation();
  const [deleteContact, { isLoading: deleteLoading }] = useDeleteContactMutation();

  const stats = statsData?.data;
  const contacts = contactsData?.data;

  // Handle status update
  const handleStatusUpdate = async (id: string, newStatus: string, adminNotes?: string) => {
    try {
      await updateContactStatus({ 
        id, 
        data: { 
          status: newStatus as any, 
          adminNotes 
        } 
      }).unwrap();
      
      Swal.fire({
        title: 'Success!',
        text: 'Contact status updated successfully',
        icon: 'success',
        confirmButtonColor: '#03045E',
        timer: 2000,
        showConfirmButton: false,
        customClass: {
          popup: 'font-cairo',
          title: 'font-cairo'
        }
      });
      
      refetch();
    } catch (error: any) {
      Swal.fire({
        title: 'Error!',
        text: error?.data?.message || 'Failed to update contact status',
        icon: 'error',
        confirmButtonColor: '#dc2626',
        customClass: {
          popup: 'font-cairo',
          title: 'font-cairo'
        }
      });
    }
  };

  // Handle delete contact
  const handleDeleteContact = async (id: string, email: string) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `This will permanently delete the contact from ${email}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!',
      customClass: {
        popup: 'font-cairo',
        title: 'font-cairo'
      }
    });

    if (result.isConfirmed) {
      try {
        await deleteContact(id).unwrap();
        
        Swal.fire({
          title: 'Deleted!',
          text: 'Contact has been deleted successfully',
          icon: 'success',
          confirmButtonColor: '#03045E',
          timer: 2000,
          showConfirmButton: false,
          customClass: {
            popup: 'font-cairo',
            title: 'font-cairo'
          }
        });
        
        refetch();
      } catch (error: any) {
        Swal.fire({
          title: 'Error!',
          text: error?.data?.message || 'Failed to delete contact',
          icon: 'error',
          confirmButtonColor: '#dc2626',
          customClass: {
            popup: 'font-cairo',
            title: 'font-cairo'
          }
        });
      }
    }
  };

  // Handle view contact details
  const handleViewContact = (contact: Contact) => {
    setSelectedContact(contact);
    setShowModal(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'read': return 'bg-yellow-100 text-yellow-800';
      case 'replied': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      case 'spam': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut" as const
      }
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <motion.div
        className="max-w-7xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 font-cairo">Contact Management</h1>
          <p className="text-gray-600 mt-2 font-cairo">Manage and respond to contact form submissions</p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
          {statsLoading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))
          ) : (
            <>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-sm font-medium text-gray-500 font-cairo">Total</h3>
                <p className="text-2xl font-bold text-gray-900">{stats?.total || 0}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-sm font-medium text-gray-500 font-cairo">New</h3>
                <p className="text-2xl font-bold text-blue-600">{stats?.new || 0}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-sm font-medium text-gray-500 font-cairo">Read</h3>
                <p className="text-2xl font-bold text-yellow-600">{stats?.read || 0}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-sm font-medium text-gray-500 font-cairo">Replied</h3>
                <p className="text-2xl font-bold text-green-600">{stats?.replied || 0}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-sm font-medium text-gray-500 font-cairo">Closed</h3>
                <p className="text-2xl font-bold text-gray-600">{stats?.closed || 0}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-sm font-medium text-gray-500 font-cairo">Spam</h3>
                <p className="text-2xl font-bold text-red-600">{stats?.spam || 0}</p>
              </div>
            </>
          )}
        </motion.div>

        {/* Filters */}
        <motion.div variants={itemVariants} className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-cairo">Search</label>
              <input
                type="text"
                placeholder="Search by email, subject, or message..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-cairo"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-cairo">Status Filter</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-cairo"
              >
                <option value="">All Statuses</option>
                <option value="new">New</option>
                <option value="read">Read</option>
                <option value="replied">Replied</option>
                <option value="closed">Closed</option>
                <option value="spam">Spam</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => refetch()}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors font-cairo"
              >
                Refresh
              </button>
            </div>
          </div>
        </motion.div>

        {/* Contacts Table */}
        <motion.div variants={itemVariants} className="bg-white rounded-lg shadow-sm overflow-hidden">
          {contactsLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600 font-cairo">Loading contacts...</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-cairo">Contact</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-cairo">Subject</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-cairo">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-cairo">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-cairo">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {contacts?.contacts?.map((contact) => (
                      <tr key={contact._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900 font-cairo">{contact.email}</div>
                            {contact.name && (
                              <div className="text-sm text-gray-500 font-cairo">{contact.name}</div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 font-cairo max-w-xs truncate">
                            {contact.subject}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(contact.status)}`}>
                            {contact.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-cairo">
                          {formatDate(contact.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleViewContact(contact)}
                              className="text-blue-600 hover:text-blue-900 font-cairo"
                            >
                              View
                            </button>
                            <select
                              value={contact.status}
                              onChange={(e) => handleStatusUpdate(contact._id, e.target.value)}
                              className="text-sm border border-gray-300 rounded px-2 py-1 font-cairo"
                              disabled={updateLoading}
                            >
                              <option value="new">New</option>
                              <option value="read">Read</option>
                              <option value="replied">Replied</option>
                              <option value="closed">Closed</option>
                              <option value="spam">Spam</option>
                            </select>
                            <button
                              onClick={() => handleDeleteContact(contact._id, contact.email)}
                              className="text-red-600 hover:text-red-900 font-cairo"
                              disabled={deleteLoading}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {contacts && contacts.totalPages > 1 && (
                <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                  <div className="flex-1 flex justify-between sm:hidden">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-cairo"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setCurrentPage(Math.min(contacts.totalPages, currentPage + 1))}
                      disabled={currentPage === contacts.totalPages}
                      className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-cairo"
                    >
                      Next
                    </button>
                  </div>
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700 font-cairo">
                        Showing <span className="font-medium">{((currentPage - 1) * limit) + 1}</span> to{' '}
                        <span className="font-medium">
                          {Math.min(currentPage * limit, contacts.total)}
                        </span>{' '}
                        of <span className="font-medium">{contacts.total}</span> results
                      </p>
                    </div>
                    <div>
                      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                        <button
                          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                          disabled={currentPage === 1}
                          className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-cairo"
                        >
                          Previous
                        </button>
                        {Array.from({ length: Math.min(5, contacts.totalPages) }, (_, i) => {
                          const page = i + 1;
                          return (
                            <button
                              key={page}
                              onClick={() => setCurrentPage(page)}
                              className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium font-cairo ${
                                currentPage === page
                                  ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                  : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                              }`}
                            >
                              {page}
                            </button>
                          );
                        })}
                        <button
                          onClick={() => setCurrentPage(Math.min(contacts.totalPages, currentPage + 1))}
                          disabled={currentPage === contacts.totalPages}
                          className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-cairo"
                        >
                          Next
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </motion.div>

        {/* Contact Details Modal */}
        {showModal && selectedContact && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900 font-cairo">Contact Details</h3>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 font-cairo">Email</label>
                    <p className="mt-1 text-sm text-gray-900 font-cairo">{selectedContact.email}</p>
                  </div>
                  
                  {selectedContact.name && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 font-cairo">Name</label>
                      <p className="mt-1 text-sm text-gray-900 font-cairo">{selectedContact.name}</p>
                    </div>
                  )}
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 font-cairo">Subject</label>
                    <p className="mt-1 text-sm text-gray-900 font-cairo">{selectedContact.subject}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 font-cairo">Message</label>
                    <p className="mt-1 text-sm text-gray-900 font-cairo whitespace-pre-wrap">{selectedContact.message}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 font-cairo">Status</label>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedContact.status)}`}>
                      {selectedContact.status}
                    </span>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 font-cairo">Submitted</label>
                    <p className="mt-1 text-sm text-gray-900 font-cairo">{formatDate(selectedContact.createdAt)}</p>
                  </div>
                  
                  {selectedContact.adminNotes && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 font-cairo">Admin Notes</label>
                      <p className="mt-1 text-sm text-gray-900 font-cairo">{selectedContact.adminNotes}</p>
                    </div>
                  )}
                  
                  {selectedContact.repliedAt && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 font-cairo">Replied At</label>
                      <p className="mt-1 text-sm text-gray-900 font-cairo">{formatDate(selectedContact.repliedAt)}</p>
                    </div>
                  )}
                  
                  {selectedContact.closedAt && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 font-cairo">Closed At</label>
                      <p className="mt-1 text-sm text-gray-900 font-cairo">{formatDate(selectedContact.closedAt)}</p>
                    </div>
                  )}
                </div>
                
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 font-cairo"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ContactManagement;
