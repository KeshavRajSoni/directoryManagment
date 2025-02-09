using DirectoryManagementAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[Route("api/[controller]")]
[ApiController]
public class BusinessesController : ControllerBase
{
    private readonly DirectoryContext _context;

    public BusinessesController(DirectoryContext context)
    {
        _context = context;
    }

    // GET: api/Businesses
    [HttpGet]
    public async Task<ActionResult<PagedResponse<Business>>> GetBusinesses(
     int pageNumber = 1,
     int pageSize = 10,
     string sortBy = "Name",
     string sortOrder = "asc",
     string keyword = "")
    {
        // Validate pageNumber and pageSize
        if (pageNumber < 1)
        {
            return BadRequest("pageNumber must be greater than or equal to 1.");
        }
        if (pageSize < 1 || pageSize > 100)
        {
            return BadRequest("pageSize must be between 1 and 100.");
        }

        var query = _context.Businesses.Include(b => b.Category) // Include Category
        .AsQueryable();

        // Apply search filter
        if (!string.IsNullOrEmpty(keyword))
        {
            keyword = keyword.Trim().ToLower();
            query = query.Where(b =>
                b.Name.ToLower().Contains(keyword) ||
                b.City.ToLower().Contains(keyword));
        }

        // Calculate totalRecords AFTER applying the search filter
        var totalRecords = await query.CountAsync();

        // If pageNumber exceeds total pages, return empty data
        var totalPages = (int)Math.Ceiling(totalRecords / (double)pageSize);
        if (pageNumber > totalPages)
        {
            return Ok(new PagedResponse<Business>
            {
                TotalRecords = totalRecords,
                PageNumber = pageNumber,
                PageSize = pageSize,
                Data = new List<Business>()
            });
        }

        // Apply sorting
        if (sortBy.Equals("Name", StringComparison.OrdinalIgnoreCase))
        {
            query = sortOrder.Equals("asc", StringComparison.OrdinalIgnoreCase)
                ? query.OrderBy(b => b.Name)
                : query.OrderByDescending(b => b.Name);
        }
        else if (sortBy.Equals("City", StringComparison.OrdinalIgnoreCase))
        {
            query = sortOrder.Equals("asc", StringComparison.OrdinalIgnoreCase)
                ? query.OrderBy(b => b.City)
                : query.OrderByDescending(b => b.City);
        }
        else if (sortBy.Equals("BusinessID", StringComparison.OrdinalIgnoreCase))
        {
            query = sortOrder.Equals("asc", StringComparison.OrdinalIgnoreCase)
                ? query.OrderBy(b => b.BusinessId)
                : query.OrderByDescending(b => b.BusinessId);
        }

        // Apply pagination
        var businesses = await query
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        // Create response
        var response = new PagedResponse<Business>
        {
            TotalRecords = totalRecords,
            PageNumber = pageNumber,
            PageSize = pageSize,
            Data = businesses
        };

        return Ok(response);
    }

    // GET: api/Businesses/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Business>> GetBusiness(int id)
    {
        var business = await _context.Businesses
            .Include(b => b.Category) // Include Category
            .FirstOrDefaultAsync(b => b.BusinessId == id);

        if (business == null)
        {
            return NotFound();
        }

        return business;
    }

    // POST: api/businesses
    [HttpPost]
    public async Task<ActionResult<Business>> PostBusiness(Business business)
    {
        _context.Businesses.Add(business);
        await _context.SaveChangesAsync();

        // Reload the entity to include Category
        var createdBusiness = await _context.Businesses
            .Include(b => b.Category)
            .FirstOrDefaultAsync(b => b.BusinessId == business.BusinessId);

        return CreatedAtAction("GetBusiness", new { id = business.BusinessId }, createdBusiness);
    }

    // PUT: api/Businesses/5
    [HttpPut("{id}")]
    public async Task<IActionResult> PutBusiness(int id, Business business)
    {
        if (id != business.BusinessId)
        {
            return BadRequest("ID mismatch.");
        }

        _context.Entry(business).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!_context.Businesses.Any(e => e.BusinessId == id))
            {
                return NotFound();
            }
            else
            {
                throw;
            }
        }

        // Reload the entity to include Category
        var updatedBusiness = await _context.Businesses
            .Include(b => b.Category)
            .FirstOrDefaultAsync(b => b.BusinessId == id);

        return Ok(updatedBusiness); // Return the updated business with Category
    }

    // DELETE: api/Businesses/5

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteBusiness(int id)

    {
        var business = await _context.Businesses
            .Include(b => b.Category) // Include Category
            .FirstOrDefaultAsync(b => b.BusinessId == id);

        if (business == null)
        {
            return NotFound();
        }

        _context.Businesses.Remove(business);
        await _context.SaveChangesAsync();

        return Ok(business); // Return the deleted business with Category
    }

}
