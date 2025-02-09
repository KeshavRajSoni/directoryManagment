using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace DirectoryManagementAPI.Models;

public partial class Category
{
    public int CategoryId { get; set; }

    public string Name { get; set; } = null!;

    [JsonIgnore]
    public virtual ICollection<Business> Businesses { get; set; } = new List<Business>();
}
