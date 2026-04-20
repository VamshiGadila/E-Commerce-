package com.backend.backend.service;

import com.backend.backend.dto.request.ProductRequest;
import com.backend.backend.dto.response.ProductResponse;
import com.backend.backend.exception.ResourceNotFoundException;
import com.backend.backend.model.Product;
import com.backend.backend.repository.ProductRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;

    public List<ProductResponse> getAllProducts() {
        return productRepository.findAll()
                .stream()
                .map(ProductResponse::from)
                .toList();
    }

    public ProductResponse getById(Long id) {
        return ProductResponse.from(findById(id));
    }

    public List<ProductResponse> getByCategory(String category) {
        return productRepository.findByCategory(category)
                .stream()
                .map(ProductResponse::from)
                .toList();
    }

    public List<ProductResponse> search(String keyword) {
        return productRepository.searchProducts(keyword)
                .stream()
                .map(ProductResponse::from)
                .toList();
    }

    public List<String> getCategories() {
        return productRepository.findAllCategories();
    }

    public ProductResponse create(ProductRequest req) {

        Product product = Product.builder()
                .name(req.getName())
                .description(req.getDescription())
                .price(req.getPrice())
                .stock(req.getStock())
                .category(req.getCategory())
                .imageUrl(req.getImageUrl())
                .build();

        return ProductResponse.from(productRepository.save(product));
    }
public ProductResponse update(Long id, ProductRequest req) {
    Product product = findById(id);
    product.setName(req.getName());
    product.setDescription(req.getDescription());
    product.setPrice(req.getPrice());
    product.setStock(req.getStock());
    product.setCategory(req.getCategory());
    if (req.getImageUrl() != null && !req.getImageUrl().isBlank()) {
        product.setImageUrl(req.getImageUrl());
    }
    return ProductResponse.from(productRepository.save(product));
}

    public void delete(Long id) {
        Product product = findById(id);
        productRepository.delete(product);
    }

    private Product findById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Product not found: " + id)
                );
    }
}