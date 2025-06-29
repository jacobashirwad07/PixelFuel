import basket_icon from './basket_icon.png'
import logo from './logo.png'
import search_icon from './search_icon.png'

import add_icon_white from './add_icon_white.png'
import add_icon_green from './add_icon_green.png'
import remove_icon_red from './remove_icon_red.png'
import app_store from './app_store.png'
import play_store from './play_store.png'
import linkedin_icon from './linkedin_icon.png'
import facebook_icon from './facebook_icon.png'
import twitter_icon from './twitter_icon.png'
import cross_icon from './cross_icon.png'
import selector_icon from './selector_icon.png'
import rating_starts from './rating_starts.png'
import profile_icon from './profile_icon.png'
import bag_icon from './bag_icon.png'
import logout_icon from './logout_icon.png'
import parcel_icon from './parcel_icon.png'
import checked from './checked.png'
import un_checked from './un_checked.png'

// Game category cover images
import action_cover from './action.jpg'
import rpg_cover from './rpg.png'
import vr_cover from './vr.png'
import strategy_cover from './strategy.jpg'
import racing_cover from './racing.jpg'
import adventure_cover from './adventure.jpg'
import sports_cover from './sports.jpg'
import puzzle_cover from './puzzle.jpg'

import menu_1 from './menu_1.png';
import menu_2 from './menu_2.png';
import menu_3 from './menu_3.png';
import menu_4 from './menu_4.png';
import menu_5 from './menu_5.png';
import menu_6 from './menu_6.png';
import menu_7 from './menu_7.png';
import menu_8 from './menu_8.png';

export const assets = {
    logo,
    basket_icon,
    search_icon,
    rating_starts,
    add_icon_green,
    add_icon_white,
    remove_icon_red,
    app_store,
    play_store,
    linkedin_icon,
    facebook_icon,
    twitter_icon,
    cross_icon,
    selector_icon,
    profile_icon,
    logout_icon,
    bag_icon,
    parcel_icon,
    checked,
    un_checked
}

export const category_list = [
    {
        category_name: "Action",
        category_image: menu_1
    },
    {
        category_name: "RPG",
        category_image: menu_2
    },
    {
        category_name: "VR Sims",
        category_image: menu_3
    },
    {
        category_name: "Strategy",
        category_image: menu_4
    },
    {
        category_name: "Racing",
        category_image: menu_5
    },
    {
        category_name: "Adventure",
        category_image: menu_6
    },
    {
        category_name: "Sports",
        category_image: menu_7
    },
    {
        category_name: "Puzzle",
        category_image: menu_8
    }
]

export const game_list = [
    {
        _id: "1",
        name: "Red Dead Redemption 2",
        image: action_cover,
        price: 59,
        description: "Epic Western action-adventure.",
        category: "Action"
    },
    {
        _id: "2",
        name: "God of War Ragnarök",
        image: rpg_cover,
        price: 69,
        description: "Mythical Norse RPG adventure.",
        category: "RPG"
    },
    {
        _id: "3",
        name: "Job Simulator",
        image: vr_cover,
        price: 39,
        description: "Hilarious VR job simulation.",
        category: "VR Sims"
    },
    {
        _id: "4",
        name: "Sid Meier's Civilization VI",
        image: strategy_cover,
        price: 29,
        description: "Turn-based empire-building strategy.",
        category: "Strategy"
    },
    {
        _id: "5",
        name: "Assesto Corza",
        image: racing_cover,
        price: 19,
        description: "Realistic racing simulation.",
        category: "Racing"
    },
    {
        _id: "6",
        name: "The Legend of Zelda: Tears of the Kingdom",
        image: adventure_cover,
        price: 24,
        description: "Epic open-world adventure.",
        category: "Adventure"
    },
    {
        _id: "7",
        name: "EA Sports FC 24 (FIFA 24)",
        image: sports_cover,
        price: 34,
        description: "The latest in football simulation.",
        category: "Sports"
    },
    {
        _id: "8",
        name: "Portal 2",
        image: puzzle_cover,
        price: 14,
        description: "Mind-bending puzzle adventure.",
        category: "Puzzle"
    }
]
