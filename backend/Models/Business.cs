using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace DirectoryManagementAPI.Models;


public class Business
{
    public Business()
    {
        Name = string.Empty;
        Address = string.Empty;
        City = string.Empty;
        State = string.Empty;
        ZipCode = string.Empty;
        PhoneNumber = string.Empty;
        Website = string.Empty;
    }

    public int BusinessId { get; set; }

    [Required(ErrorMessage = "Business Name is required.")]
    public string? Name { get; set; }

    public string? Address { get; set; }

    public string? City { get; set; }

    public string? State { get; set; }

    public string? ZipCode { get; set; }

    [Required(ErrorMessage = "Phone Number is required.")]
    [RegularExpression(@"^\d{10}$", ErrorMessage = "Phone Number must be a 10-digit number.")]
    public string? PhoneNumber { get; set; }

    [Url(ErrorMessage = "Website must be a valid URL.")]
    public string? Website { get; set; }

    [Range(0, 5, ErrorMessage = "Rating must be between 0 and 5.")]
    public decimal? Rating { get; set; }

    public int? CategoryId { get; set; }
    public Category? Category { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}