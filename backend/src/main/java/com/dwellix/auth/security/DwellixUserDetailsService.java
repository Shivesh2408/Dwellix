package com.dwellix.auth.security;

import com.dwellix.auth.repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class DwellixUserDetailsService implements UserDetailsService {
  private final UserRepository userRepository;

  public DwellixUserDetailsService(UserRepository userRepository) {
    this.userRepository = userRepository;
  }

  @Override
  public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
    return userRepository.findByEmailIgnoreCase(username)
        .map(CurrentUserPrincipal::from)
        .orElseThrow(() -> new UsernameNotFoundException("User not found."));
  }
}
