package com.dwellix.auth.security;

import com.dwellix.auth.booking.repository.TechnicianRepository;
import com.dwellix.auth.repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class DwellixUserDetailsService implements UserDetailsService {
  private final UserRepository userRepository;
  private final TechnicianRepository technicianRepository;

  public DwellixUserDetailsService(UserRepository userRepository, TechnicianRepository technicianRepository) {
    this.userRepository = userRepository;
    this.technicianRepository = technicianRepository;
  }

  @Override
  public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
    var userOpt = userRepository.findByEmailIgnoreCase(username);
    if (userOpt.isPresent()) {
      return CurrentUserPrincipal.from(userOpt.get());
    }
    var techOpt = technicianRepository.findByEmailIgnoreCase(username);
    if (techOpt.isPresent()) {
      return CurrentUserPrincipal.from(techOpt.get());
    }
    throw new UsernameNotFoundException("User or technician not found.");
  }
}
