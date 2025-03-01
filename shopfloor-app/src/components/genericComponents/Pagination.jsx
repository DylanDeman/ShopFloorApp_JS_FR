export function Pagination({currentPage, setCurrentPage, data, loading}){

    const handlePageChange = (newPage) => {
        if(data.totalPages >= newPage){
            setCurrentPage(newPage);
        }
      };

    return (
        <div className="flex justify-center text-center gap-2">
            <button className="transition-all font-bold hover:scale-110 hover:cursor-pointer"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1 || loading}
            >
            Prev
            </button>
            <span className="font-semibold">Page {currentPage}</span>
            <button className="transition-all font-bold hover:scale-110 hover:cursor-pointer"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={loading}
            >
            Next
            </button>
        </div>
    )
}

