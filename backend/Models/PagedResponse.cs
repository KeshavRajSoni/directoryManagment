namespace DirectoryManagementAPI.Models
{
    public class PagedResponse<T>
    {
        public int TotalRecords { get; set; } // Total number of records
        public int PageNumber { get; set; }   // Current page number
        public int PageSize { get; set; }     // Number of records per page
        public List<T> Data { get; set; }     // List of records for the current page

        public PagedResponse()
        {
            Data = new List<T>();
        }
    }
}