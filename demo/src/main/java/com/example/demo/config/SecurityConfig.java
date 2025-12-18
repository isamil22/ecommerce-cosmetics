package com.example.demo.config;

import com.example.demo.repositories.UserRepository;
import com.example.demo.service.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import java.util.List;

import static org.springframework.security.config.Customizer.withDefaults;


@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {
    private final UserRepository userRepository;
    private final JwtService jwtService;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(withDefaults())
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                "/swagger-ui/**",
                                "/v3/api-docs/**",
                                "/swagger-ui.html"
                        ).permitAll()
                        .requestMatchers(HttpMethod.POST,
                                "/api/auth/login",
                                "/api/auth/register",
                                "/api/auth/confirm-email",
                                "/api/auth/forgot-password",
                                "/api/auth/reset-password",
                                "/api/orders/guest",
                                "/api/test-post",
                                "/api/cart/add" // Allow guest users to add to cart
                        )
                        .permitAll()
                        .requestMatchers(HttpMethod.GET,
                                "/api/products/**",
                                "/api/categories/**",
                                "/api/reviews/**",
                                "/api/packs/**",
                                "/api/hero",
                                "/api/comments/product/**",
                                "/api/settings",
                                "/api/announcement",
                                "/api/countdown",
                                "/api/custom-packs/**", // Fixed: Allow access to all custom-packs endpoints
                                "/api/products/packable",
                                "/api/cart", // Allow guest users to view cart
                                "/api/coupons/validate/**", // Allow coupon validation without authentication
                                "/api/auth/debug/authorities", // Allow debug endpoint for troubleshooting
                                "/api/orders/*/feedback", // Allow access to order feedback
                                "/api/images/**", // Allow public access to images
                                "/api/landing-pages/public/**", // Allow public access to published landing pages
                                "/api/enhanced-visitor-counter-settings" // Allow public access to visitor settings
                        )
                        .permitAll()
                        .requestMatchers("/", "/index.html", "/images/**", "/vite.svg").permitAll()
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:5173", "http://localhost:8081", "http://localhost:3000", "http://localhost:8085", "http://72.60.185.187:5173", "http://byluna.ma"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("Authorization", "Content-Type"));
        configuration.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public JwtAuthenticationFilter jwtAuthenticationFilter(){
        return new JwtAuthenticationFilter(jwtService, userDetailsService());
    }

    @Bean
    public PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception{
        return authConfig.getAuthenticationManager();
    }

    @Bean
    public UserDetailsService userDetailsService(){
        return username -> (UserDetails) userRepository.findByEmailWithRolesAndPermissions(username)
                .orElseThrow(()-> new UsernameNotFoundException("User not found"));
    }
}