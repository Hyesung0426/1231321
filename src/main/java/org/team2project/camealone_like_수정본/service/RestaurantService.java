package org.team2project.camealone.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.team2project.camealone.entity.RestaurantFavorites;
import org.team2project.camealone.repository.RestaurantFavoritesRepository;

@Service
public class RestaurantService {

    @Autowired
    private RestaurantFavoritesRepository restaurantFavoritesRepository;

    public void saveRestaurantToFavorites(RestaurantFavorites restaurant) {
        restaurantFavoritesRepository.save(restaurant);
    }
}