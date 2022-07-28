import {
  CButton,
  CFormInput,
  CInputGroup,
  CInputGroupText,
} from "@coreui/react";
import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { useToast, immediateToast } from "izitoast-react";
import axios from "src/api/axios";
import {
  DeleteIconWhite,
  EditIcon2White,
  EditIconWhite,
  KeyIcon,
  KeyIconWhite,
} from "src/assets/icons";
import Modal from "src/components/Modal";
import dateFormatter from "src/tools/DateFormatter";

const Mahasiswa = () => {
  const MAHASISWA_URL = "/mahasiswa/";
  const access_token = localStorage.getItem("access_token");
  const [mahasiswa, setMahasiswa] = useState("");
  const confirmDelete = (e) => {
    immediateToast("question", {
      timeout: 20000,
      close: false,
      overlay: true,
      displayMode: "once",
      id: "question",
      zindex: 9999,
      title: "Hey",
      message: `Yakin Ingin Menghapus : ${e.name}`,
      position: "center",
      buttons: [
        [
          "<button><b>YES</b></button>",
          (instance, toast) => {
            deleteMahasiswa(e.id).then((res) => {
              alertSuccess(res.message);
              getMahasiswa(access_token).then((res) => {
                setMahasiswa(res);
              });
              instance.hide({ transitionOut: "fadeOut" }, toast, "button");
            });
          },
          true,
        ],
        [
          "<button>NO</button>",
          function (instance, toast) {
            instance.hide({ transitionOut: "fadeOut" }, toast, "button");
          },
        ],
      ],
      onClosing: function (instance, toast, closedBy) {
        console.info("Closing | closedBy: " + closedBy);
      },
      onClosed: function (instance, toast, closedBy) {
        console.info("Closed | closedBy: " + closedBy);
      },
    });
  };

  const deleteMahasiswa = async (id) => {
    let data = {};
    await axios
      .delete(MAHASISWA_URL + id, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      })
      .then((res) => {
        data = res.data;
      })
      .catch((err) => {
        data = err.data;
      });

    return data;
  };

  const alertSuccess = (message) => {
    immediateToast("success", {
      message: message,
    });
  };

  useEffect(() => {
    getMahasiswa(access_token).then((res) => {
      setMahasiswa(res);
    });
  }, []);

  function getNumberOfPages(rowCount, rowsPerPage) {
    return Math.ceil(rowCount / rowsPerPage);
  }

  function toPages(pages) {
    const results = [];

    for (let i = 1; i < pages; i++) {
      results.push(i);
    }

    return results;
  }

  const columns = [
    {
      name: "Nama Lengkap",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "NIM",
      selector: (row) => row.nim,
      sortable: true,
    },
    {
      name: "Kelas",
      selector: (row) => row.kelas_id,
      sortable: true,
    },
    {
      name: "User Id",
      selector: (row) => row.user_id,
      sortable: true,
    },
    {
      name: "Created At",
      selector: (row) => dateFormatter(row.createdAt),
      sortable: true,
    },
    {
      button: true,
      minWidth: "250px",
      cell: (row) => (
        <div className="App">
          <div className="openbtn">
            <div className="d-flex">
              <Modal
                btnColor="primary"
                btnClass=""
                modalTitle="Change Password"
                btnTitle={<EditIcon2White width={15} />}
              >
                <div>
                  <label htmlFor="name" className="mb-2">
                    Nama Lengkap
                  </label>
                  <CInputGroup size="sm" className="mb-3">
                    <CFormInput
                      id="name"
                      value={row.name}
                      aria-label="Sizing example input"
                      aria-describedby="inputGroup-sizing-sm"
                      placeholder="name"
                    />
                  </CInputGroup>
                </div>
                <div>
                  <label htmlFor="nim" className="mb-2">
                    NIM
                  </label>
                  <CInputGroup size="sm" className="mb-3">
                    <CFormInput
                      id="nim"
                      value={row.nim}
                      aria-label="Sizing example input"
                      aria-describedby="inputGroup-sizing-sm"
                      placeholder="Nama Lengkap"
                    />
                  </CInputGroup>
                </div>
                <div>
                  <label htmlFor="kelas" className="mb-2">
                    Kelas
                  </label>
                  <CInputGroup size="sm" className="mb-3">
                    <CFormInput
                      id="kelas"
                      value={row.kelas_id}
                      aria-label="Sizing example input"
                      aria-describedby="inputGroup-sizing-sm"
                      placeholder="kelas"
                    />
                  </CInputGroup>
                </div>
              </Modal>
              <Modal
                btnColor="info"
                modalTitle="Change Password"
                btnClass="mx-2"
                btnTitle={<KeyIconWhite width={15} />}
              >
                <div>
                  <label htmlFor="new-password" className="mb-2">
                    New Password
                  </label>
                  <CInputGroup size="sm" className="mb-3">
                    <CFormInput
                      id="new-password"
                      aria-label="Sizing example input"
                      aria-describedby="inputGroup-sizing-sm"
                      placeholder="New Password"
                    />
                  </CInputGroup>
                </div>
                <div>
                  <label htmlFor="confirm-password" className="mb-2">
                    Confirm Password
                  </label>
                  <CInputGroup size="sm" className="mb-3">
                    <CFormInput
                      id="confirm-password"
                      aria-label="Sizing example input"
                      aria-describedby="inputGroup-sizing-sm"
                      placeholder="Confirm Password"
                    />
                  </CInputGroup>
                </div>
              </Modal>
              <CButton
                color="danger"
                className="text-xs text-light text-nowrap"
                onClick={() => {
                  confirmDelete(row);
                }}
                title="delete"
              >
                <DeleteIconWhite width={15} />
              </CButton>
            </div>
          </div>
        </div>
      ),
    },
  ];

  // RDT exposes the following internal pagination properties
  const BootyPagination = ({
    rowsPerPage,
    rowCount,
    onChangePage,
    onChangeRowsPerPage, // available but not used here
    currentPage,
  }) => {
    const handleBackButtonClick = () => {
      onChangePage(currentPage - 1);
    };

    const handleNextButtonClick = () => {
      onChangePage(currentPage + 1);
    };

    const handlePageNumber = (e) => {
      onChangePage(Number(e.target.value));
    };

    const pages = getNumberOfPages(rowCount, rowsPerPage);
    const pageItems = toPages(pages);
    const nextDisabled = currentPage === pageItems.length;
    const previosDisabled = currentPage === 1;

    return (
      <nav className="mt-2 d-flex justify-content-center">
        <ul className="pagination">
          <li className="page-item">
            <button
              className="page-link"
              onClick={handleBackButtonClick}
              disabled={previosDisabled}
              aria-disabled={previosDisabled}
              aria-label="previous page"
            >
              Previous
            </button>
          </li>
          {pageItems.map((page) => {
            const className =
              page === currentPage ? "page-item active" : "page-item";

            return (
              <li key={page} className={className}>
                <button
                  className="page-link"
                  onClick={handlePageNumber}
                  value={page}
                >
                  {page}
                </button>
              </li>
            );
          })}
          <li className="page-item">
            <button
              className="page-link"
              onClick={handleNextButtonClick}
              disabled={nextDisabled}
              aria-disabled={nextDisabled}
              aria-label="next page"
            >
              Next
            </button>
          </li>
        </ul>
      </nav>
    );
  };

  const BootyCheckbox = React.forwardRef(({ onClick, ...rest }, ref) => (
    <div className="form-check">
      <input
        htmlFor="booty-check"
        type="checkbox"
        className="form-check-input"
        ref={ref}
        onClick={onClick}
        {...rest}
      />
      <label className="form-check-label" id="booty-check" />
    </div>
  ));

  const getMahasiswa = async (access_token) => {
    let data = {};
    await axios
      .get(MAHASISWA_URL, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      })
      .then((res) => {
        data = res.data.data;
      })
      .catch((err) => {
        console.log(err);
      });

    return data;
  };

  return (
    <div className="App">
      <div className="card">
        <DataTable
          title="Mahasiswa"
          columns={columns}
          data={mahasiswa && mahasiswa}
          defaultSortFieldID={1}
          pagination
          // paginationComponent={BootyPagination}
          selectableRows
          selectableRowsComponent={BootyCheckbox}
        />
      </div>
      {/* {mahasiswa && JSON.stringify(mahasiswa, null, 2)} */}
    </div>
  );
};

export default Mahasiswa;