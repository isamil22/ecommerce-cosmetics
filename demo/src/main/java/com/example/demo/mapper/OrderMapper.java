package com.example.demo.mapper;

import com.example.demo.dto.OrderDTO;
import com.example.demo.dto.OrderItemDTO;
import com.example.demo.model.Order;
import com.example.demo.model.OrderItem;
import com.example.demo.repositories.CouponRepository;
import com.example.demo.repositories.UserRepository;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.springframework.beans.factory.annotation.Autowired;

import java.math.BigDecimal;
import java.util.List;

@Mapper(componentModel = "spring")
public abstract class OrderMapper {

    @Autowired
    protected UserRepository userRepository;

    @Autowired
    protected CouponRepository couponRepository;

    // --- DTO to Entity Mappings ---
    @Mapping(target = "user", expression = "java(userRepository.findById(orderDTO.getUserId()).orElse(null))")
    @Mapping(target = "items", source = "orderItems")
    // Mapping for converting coupon code from DTO to Coupon entity
    @Mapping(target = "coupon", expression = "java(orderDTO.getCouponCode() != null ? couponRepository.findByCode(orderDTO.getCouponCode()).orElse(null) : null)")
    public abstract Order toEntity(OrderDTO orderDTO);

    @Mapping(target = "product.id", source = "productId")
    @Mapping(target = "order", ignore = true)
    public abstract OrderItem toOrderItemEntity(OrderItemDTO orderItemDTO);

    // --- Entity to DTO Mappings ---
    @Mapping(target = "userId", source = "user.id")
    @Mapping(target = "orderItems", source = "items")
    // Safely map the coupon code to the DTO, handling nulls
    @Mapping(target = "couponCode", expression = "java(order.getCoupon() != null ? order.getCoupon().getCode() : null)")
    @Mapping(target = "total", source = "order", qualifiedByName = "calculateTotal")
    public abstract OrderDTO toDTO(Order order);

    @Named("calculateTotal")
    protected BigDecimal calculateTotal(Order order) {
        if (order == null)
            return BigDecimal.ZERO;

        BigDecimal itemsTotal = BigDecimal.ZERO;
        if (order.getItems() != null) {
            itemsTotal = order.getItems().stream()
                    .filter(item -> item.getPrice() != null)
                    .map(item -> item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
        }

        BigDecimal shipping = order.getShippingCost() != null ? order.getShippingCost() : BigDecimal.ZERO;
        BigDecimal discount = order.getDiscountAmount() != null ? order.getDiscountAmount() : BigDecimal.ZERO;

        return itemsTotal.add(shipping).subtract(discount);
    }

    @Mapping(target = "productId", expression = "java(orderItem.getProduct() != null ? orderItem.getProduct().getId() : null)")
    @Mapping(target = "productName", source = "productName")
    @Mapping(target = "imageUrl", source = "productImage")
    @Mapping(target = "variantName", source = "variantName")
    public abstract OrderItemDTO toOrderItemDTO(OrderItem orderItem);

    // --- List Mappings ---
    public abstract List<OrderDTO> toDTOs(List<Order> orders);

    public abstract List<Order> toEntities(List<OrderDTO> orderDTOS);

    public abstract List<OrderItemDTO> toOrderItemDTOs(List<OrderItem> items);

    public abstract List<OrderItem> toOrderItemEntities(List<OrderItemDTO> orderItems);
}