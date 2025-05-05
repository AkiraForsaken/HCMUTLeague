import bklogo from './bklogo.png'
import menu_icon from './menu_icon.svg'
import profile_pic from './profile_pic.png'
import soccer_banner from './soccer_banner.jpg'
import man_united_logo from './man_united-removebg-preview.png'
import arsenal_logo from './arsenal-removebg-preview.png'
import liverpool_logo from './liverpool-removebg-preview.png'
import nottingham_logo from './nottingham-removebg-preview.png'
import chelsea_logo from './chelsea-removebg-preview.png'
import newcastle_logo from './newcastle-removebg-preview.png'
import man_city_logo from './manchester_city-removebg-preview.png'
import astonvilla_logo from './aston_villa-removebg-preview.png'
import fulham_logo from './fulham-removebg-preview.png'
import brighton_logo from './Brighton-removebg-preview.png'
import bournemouth_logo from './bournemouth-removebg-preview.png'
import crystal_palace_logo from './crystal_palace-removebg-preview.png'
import brentford_logo from './brentford-fc-removebg-preview.png'
import everton_logo from './everton-removebg-preview.png'
import leicester_logo from './leicester_city-removebg-preview.png'
import southampton_logo from './southampton-removebg-preview.png'
import tottenham_logo from './tottenham-removebg-preview.png'
import wesham_logo from './west_ham-removebg-preview.png'
import wolves_logo from './wolves-removebg-preview.png'

// stadium view
import oldtrafford from './oldtrafford.jpg';
import anfield from './anfield.jpg';
import stamfordbridge from './stamfordbridge.jpg';
import emiratesstadium from './emiratesstadium.jpg';
import etihadstadium from './etihadstadium.jpg';
import tottenhamhotspurstadium from './tottenhamhotspurstadium.jpg';
import goodisonpark from './goodisonpark.jpg';
import kingpowerstadium from './kingpowerstadium.jpg';
import ellandroad from './ellandroad.jpg';
import londonstadium from './londonstadium.jpg';
import stjamespark from './stjamespark.jpg';
import villapark from './villapark.jpg';
import amexstadium from './amexstadium.jpg';
import molineuxstadium from './molineuxstadium.jpg';
import stmarysstadium from './stmarysstadium.jpg';

export const assets = {
    bklogo,
    menu_icon,
    profile_pic,
    man_united_logo,
    arsenal_logo,
    liverpool_logo,
    nottingham_logo,
    chelsea_logo,
    newcastle_logo,
    man_city_logo,
    astonvilla_logo,
    fulham_logo,
    brighton_logo,
    bournemouth_logo,
    crystal_palace_logo,  
    brentford_logo,
    everton_logo,
    leicester_logo,
    southampton_logo,
    tottenham_logo,
    wesham_logo,
    wolves_logo,
    soccer_banner,
    oldtrafford,
    anfield,
    stamfordbridge,
    emiratesstadium,
    etihadstadium,
    tottenhamhotspurstadium,
    goodisonpark,
    kingpowerstadium,
    ellandroad,
    londonstadium,
    stjamespark,
    villapark,
    amexstadium,
    molineuxstadium,
    stmarysstadium,
}

export const teams = [
    {
      position: 1,
      club: 'Liverpool',
      logo: liverpool_logo,
      backgroundColor: '#DC5032',
      played: 31,
      won: 22,
      drawn: 7,
      lost: 2,
      gf: 72,
      ga: 30,
      gd: 42,
      points: 73,
      form: ['W', 'W', 'W', 'W', 'L'],
      next: 'West Ham'
    },
    {
      position: 2,
      club: 'Arsenal',
      logo: arsenal_logo,
      backgroundColor: '#DC5032',
      played: 31,
      won: 17,
      drawn: 11,
      lost: 3,
      gf: 56,
      ga: 26,
      gd: 30,
      points: 62,
      form: ['D', 'D', 'W', 'W', 'D'],
      next: 'Brentford'
    },
    {
      position: 3,
      club: 'Nottingham Forest',
      logo: nottingham_logo,
      backgroundColor: '#DC5032',
      played: 31,
      won: 17,
      drawn: 6,
      lost: 8,
      gf: 51,
      ga: 37,
      gd: 14,
      points: 57,
      form: ['D', 'D', 'W', 'W', 'L'],
      next: 'Everton'
    },
    {
      position: 4,
      club: 'Chelsea',
      logo: chelsea_logo,
      backgroundColor: '#DC5032',
      played: 31,
      won: 15,
      drawn: 8,
      lost: 8,
      gf: 54,
      ga: 37,
      gd: 17,
      points: 53,
      form: ['W', 'W', 'L', 'W', 'D'],
      next: 'Ipswich'
    },
    {
      position: 5,
      club: 'Newcastle United',
      logo: newcastle_logo,
      backgroundColor: '#DC5032',
      played: 30,
      won: 16,
      drawn: 5,
      lost: 9,
      gf: 52,
      ga: 39,
      gd: 13,
      points: 53,
      form: ['W', 'L', 'W', 'W', 'W'],
      next: 'Man Utd'
    },
    {
      position: 6,
      club: 'Manchester City',
      logo: man_city_logo,
      backgroundColor: '#DC5032',
      played: 31,
      won: 15,
      drawn: 7,
      lost: 9,
      gf: 57,
      ga: 40,
      gd: 17,
      points: 52,
      form: ['W', 'L', 'W', 'D', 'D'],
      next: 'Crystal Palace'
    },
    {
      position: 7,
      club: 'Aston Villa',
      logo: astonvilla_logo,
      backgroundColor: '#DC5032',
      played: 31,
      won: 14,
      drawn: 9,
      lost: 8,
      gf: 46,
      ga: 46,
      gd: 0,
      points: 51,
      form: ['W', 'L', 'W', 'W', 'W'],
      next: 'Southampton'
    },
    {
      position: 8,
      club: 'Fulham',
      logo: fulham_logo,
      backgroundColor: '#DC5032',
      played: 31,
      won: 13,
      drawn: 9,
      lost: 9,
      gf: 47,
      ga: 42,
      gd: 5,
      points: 48,
      form: ['W', 'L', 'W', 'L', 'W'],
      next: 'Bournemouth'
    },
    {
      position: 9,
      club: 'Brighton And Hove Albion',
      logo: brighton_logo,
      backgroundColor: '#DC5032',
      played: 31,
      won: 12,
      drawn: 11,
      lost: 8,
      gf: 49,
      ga: 47,
      gd: 2,
      points: 47,
      form: ['W', 'W', 'L', 'L', 'L'],
      next: 'Leicester'
    },
    {
      position: 10,
      club: 'Bournemouth',
      logo: bournemouth_logo,
      backgroundColor: '#DC5032',
      played: 31,
      won: 12,
      drawn: 9,
      lost: 10,
      gf: 51,
      ga: 40,
      gd: 11,
      points: 45,
      form: ['L', 'D', 'L', 'D', 'D'],
      next: 'Fulham'
    },
    {
      position: 11,
      club: 'Crystal Palace',
      logo: crystal_palace_logo,
      backgroundColor: '#DC5032',
      played: 30,
      won: 11,
      drawn: 10,
      lost: 9,
      gf: 39,
      ga: 35,
      gd: 4,
      points: 43,
      form: ['W', 'W', 'L', 'D', 'W'],
      next: 'Man City'
    },
    {
      position: 12,
      club: 'Brentford',
      logo: brentford_logo,
      backgroundColor: '#DC5032',
      played: 31,
      won: 12,
      drawn: 6,
      lost: 13,
      gf: 51,
      ga: 47,
      gd: 4,
      points: 42,
      form: ['D', 'D', 'L', 'W', 'D'],
      next: 'Arsenal'
    },
    {
      position: 13,
      club: 'Manchester United',
      logo: man_united_logo,
      backgroundColor: '#DC5032',
      played: 31,
      won: 10,
      drawn: 8,
      lost: 13,
      gf: 37,
      ga: 41,
      gd: -4,
      points: 38,
      form: ['W', 'D', 'L', 'W', 'D'],
      next: 'Newcastle'
    },
    {
      position: 14,
      club: 'West Ham',
      logo: wesham_logo,
      backgroundColor: '#DC5032',
      played: 31,
      won: 9,
      drawn: 5,
      lost: 17,
      gf: 43,
      ga: 59,
      gd: -16,
      points: 32,
      form: ['L', 'D', 'W', 'W', 'W'],
      next: 'Newcastle'
    }
  ];

export const matches = [ // data will be fetched from database - be careful with the date
  {
    matchID: 1,
    homeTeam: 'Man City',
    homeLogo: man_city_logo,
    awayTeam: 'Crystal Palace',
    awayLogo: crystal_palace_logo,
    date: '2025-04-15', 
    time: '18:30',
    stadium: 'Etihad Stadium, Manchester'
  },
  {
    matchID: 2,
    homeTeam: 'Brighton',
    homeLogo: brighton_logo,
    awayTeam: 'Leicester',
    awayLogo: leicester_logo,
    date: '2025-04-14', 
    time: '21:00',
    stadium: 'American Express Stadium, Falmer'
  },
  {
    matchID: 3,
    homeTeam: "Nott'm Forest",
    homeLogo: nottingham_logo,
    awayTeam: 'Everton',
    awayLogo: everton_logo,
    date: '2025-04-13', 
    time: '21:00',
    stadium: 'The City Ground, Nottingham'
  },
  {
    matchID: 4,
    homeTeam: 'Southampton',
    homeLogo: southampton_logo,
    awayTeam: 'Aston Villa',
    awayLogo: astonvilla_logo,
    date: '2025-04-22', 
    time: '21:00',
    stadium: "St. Mary's Stadium, Southampton"
  },
  {
    matchID: 5,
    homeTeam: 'Arsenal',
    homeLogo: arsenal_logo,
    awayTeam: 'Brentford',
    awayLogo: brentford_logo,
    date: '2025-04-23', 
    time: '23:30',
    stadium: 'Emirates Stadium, London'
  }
]; 