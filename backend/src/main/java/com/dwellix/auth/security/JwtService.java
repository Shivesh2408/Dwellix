package com.dwellix.auth.security;

import com.dwellix.auth.config.JwtProperties;
import com.dwellix.auth.domain.UserEntity;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.time.Clock;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;

@Service
public class JwtService {
  private final JwtProperties jwtProperties;
  private final Clock clock;
  private final SecretKey secretKey;

  @Autowired
  public JwtService(JwtProperties jwtProperties) {
    this(jwtProperties, Clock.systemUTC());
  }

  public JwtService(JwtProperties jwtProperties, Clock clock) {
    this.jwtProperties = jwtProperties;
    this.clock = clock;
    this.secretKey = Keys.hmacShaKeyFor(Decoders.BASE64.decode(jwtProperties.secret()));
  }

  public String generateAccessToken(UserEntity user) {
    Map<String, Object> claims = new HashMap<>();
    claims.put("id", user.getId().toString());
    claims.put("email", user.getEmail());
    claims.put("role", user.getRole().name());
    claims.put("name", user.getFullName());
    claims.put("fullName", user.getFullName());
    claims.put("emailVerified", user.isEmailVerified());

    Instant now = clock.instant();
    Instant expiry = now.plus(jwtProperties.accessTokenTtlSeconds(), ChronoUnit.SECONDS);

    return Jwts.builder()
        .setClaims(claims)
        .setSubject(user.getEmail())
        .setIssuer(jwtProperties.issuer())
        .setIssuedAt(Date.from(now))
        .setExpiration(Date.from(expiry))
        .signWith(secretKey, SignatureAlgorithm.HS256)
        .compact();
  }

  public String generateAccessToken(String id, String email, String role, String name) {
    Map<String, Object> claims = new HashMap<>();
    claims.put("id", id);
    claims.put("email", email);
    claims.put("role", role);
    claims.put("name", name);
    claims.put("fullName", name);
    claims.put("emailVerified", true);

    Instant now = clock.instant();
    Instant expiry = now.plus(jwtProperties.accessTokenTtlSeconds(), ChronoUnit.SECONDS);

    return Jwts.builder()
        .setClaims(claims)
        .setSubject(email)
        .setIssuer(jwtProperties.issuer())
        .setIssuedAt(Date.from(now))
        .setExpiration(Date.from(expiry))
        .signWith(secretKey, SignatureAlgorithm.HS256)
        .compact();
  }

  public String extractSubject(String token) {
    return parseClaims(token).getSubject();
  }

  public boolean isValidAccessToken(String token, String username) {
    Claims claims = parseClaims(token);
    return claims.getSubject().equalsIgnoreCase(username) && claims.getExpiration().after(Date.from(clock.instant()));
  }

  public long getAccessTokenExpirySeconds() {
    return jwtProperties.accessTokenTtlSeconds();
  }

  private Claims parseClaims(String token) {
    return Jwts.parserBuilder()
        .setSigningKey(secretKey)
        .requireIssuer(jwtProperties.issuer())
        .build()
        .parseClaimsJws(token)
        .getBody();
  }
}
