using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace DirectoryManagementAPI.Models;

public partial class DirectoryContext : DbContext
{
    public DirectoryContext()
    {
    }

    public DirectoryContext(DbContextOptions<DirectoryContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Business> Businesses { get; set; }

    public virtual DbSet<Category> Categories { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseSqlServer("Server=KESHCODER;Database=Directory;Trusted_Connection=True;TrustServerCertificate=True;");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Business>(entity =>
        {
            entity.HasKey(e => e.BusinessId).HasName("PK__Business__F1EAA34EAC2D5A83");

            entity.HasIndex(e => e.PhoneNumber, "UQ_Businesses_PhoneNumber").IsUnique();

            entity.Property(e => e.BusinessId).HasColumnName("BusinessID");
            entity.Property(e => e.Address).HasMaxLength(500);
            entity.Property(e => e.City).HasMaxLength(100);
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.Name).HasMaxLength(255);
            entity.Property(e => e.PhoneNumber).HasMaxLength(20);
            entity.Property(e => e.Rating).HasColumnType("decimal(3, 2)");
            entity.Property(e => e.State)
                .HasMaxLength(100)
                .HasColumnName("STATE");
            entity.Property(e => e.UpdatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.Website).HasMaxLength(255);
            entity.Property(e => e.ZipCode).HasMaxLength(20);

            entity.HasOne(d => d.Category).WithMany(p => p.Businesses)
                .HasForeignKey(d => d.CategoryId)
                .HasConstraintName("Businesses_categoryId_FK");
        });

        modelBuilder.Entity<Category>(entity =>
        {
            entity.HasKey(e => e.CategoryId).HasName("PK__Categori__19093A2BADF4B1E8");

            entity.HasIndex(e => e.Name, "UQ__Categori__737584F643ACA3E0").IsUnique();

            entity.Property(e => e.CategoryId).HasColumnName("CategoryID");
            entity.Property(e => e.Name).HasMaxLength(100);
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
