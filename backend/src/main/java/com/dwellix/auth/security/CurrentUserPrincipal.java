package com.dwellix.auth.security;

import com.dwellix.auth.domain.Role;
import com.dwellix.auth.domain.UserEntity;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;
import java.util.UUID;

public class CurrentUserPrincipal implements UserDetails {
  private final UUID userId;
  private final String email;
  private final String passwordHash;
  private final boolean enabled;
  private final boolean accountLocked;
  private final boolean emailVerified;
  private final Role role;
  private final String fullName;

  public CurrentUserPrincipal(UUID userId, String email, String passwordHash, boolean enabled, boolean accountLocked, boolean emailVerified, Role role, String fullName) {
    this.userId = userId;
    this.email = email;
    this.passwordHash = passwordHash;
    this.enabled = enabled;
    this.accountLocked = accountLocked;
    this.emailVerified = emailVerified;
    this.role = role;
    this.fullName = fullName;
  }

  public static CurrentUserPrincipal from(UserEntity entity) {
    return new CurrentUserPrincipal(
        entity.getId(),
        entity.getEmail(),
        entity.getPasswordHash(),
        entity.isEnabled(),
        entity.isAccountLocked(),
        entity.isEmailVerified(),
        entity.getRole(),
        entity.getFullName()
    );
  }

  public UUID getUserId() {
    return userId;
  }

  public String getFullName() {
    return fullName;
  }

  public boolean isEmailVerified() {
    return emailVerified;
  }

  @Override
  public Collection<? extends GrantedAuthority> getAuthorities() {
    return List.of(new SimpleGrantedAuthority(role.name()));
  }

  @Override
  public String getPassword() {
    return passwordHash;
  }

  @Override
  public String getUsername() {
    return email;
  }

  @Override
  public boolean isAccountNonExpired() {
    return true;
  }

  @Override
  public boolean isAccountNonLocked() {
    return !accountLocked;
  }

  @Override
  public boolean isCredentialsNonExpired() {
    return true;
  }

  @Override
  public boolean isEnabled() {
    return enabled;
  }
}
