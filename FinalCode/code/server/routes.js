
const config = require('./config.json')
const mysql = require('mysql');
const e = require('express');

// fill in your connection details:
const connection = mysql.createConnection({
    host: config.rds_host,
    user: config.rds_user,
    password: config.rds_password,
    port: config.rds_port,
    database: config.rds_db
});
connection.connect();


/////////// PLAYLIST ////////////

async function playlist_getAllSongs(req, res) {
    // When page is defined:
    if (req.query.page && !isNaN(req.query.page)) {
        const page = req.query.page
        const pagesize = req.query.pagesize ? req.query.pagesize : 10
        // console.log(pagesize + " " + page)
        connection.query(`SELECT T.id AS TrackId, T.name AS TrackName, T.preview_url AS Preview, AL.name AS AlbumName, AL.images AS Cover, A.name AS ArtistName, A.genres AS Genre
                          FROM Albums AL
                          JOIN Artists A ON AL.artist_id = A.id
                          JOIN Tracks T ON AL.id = T.album_id
                          ORDER BY T.name
                          LIMIT ${(page * pagesize) - (pagesize - 1)}, ${pagesize}`, function (error, results, fields) {
            if (error) {
                console.log(error)
                res.json({ error: error })
            } else if (results) {
                res.json({ results: results })      
            }
        });
    // When page is not defined:
    } else {
        connection.query(`SELECT T.id AS TrackId, T.name AS TrackName, T.preview_url AS Preview, AL.name AS AlbumName, AL.images AS Cover, A.name AS ArtistName, A.genres AS Genre
                          FROM Albums AL
                          JOIN Artists A ON AL.artist_id = A.id
                          JOIN Tracks T ON AL.id = T.album_id
                          ORDER BY T.name
                          LIMIT 3000, 10`, function (error, results, fields) {
            if (error) {
                console.log(error)
                res.json({ error: error })
            } else if (results) {
                res.json({ results: results })      
            }
        });
    }
}


async function playlist_getPlaylist(req, res) {
    // When page is defined:
    if (req.query.page && !isNaN(req.query.page)) {
        const page = req.query.page
        const pagesize = req.query.pagesize ? req.query.pagesize : 10
        // console.log(pagesize + " " + page)
        connection.query(`SELECT * FROM Playlist
                          LIMIT ${(page * pagesize) - (pagesize - 1)}, ${pagesize}`, function (error, results, fields) {
            if (error) {
                console.log(error)
                res.json({ error: error })
            } else if (results) {
                res.json({ results: results })      
            }
        });
    // When page is not defined:
    } else {
        connection.query(`SELECT * FROM Playlist`, function (error, results, fields) {
            if (error) {
                console.log(error)
                res.json({ error: error })
            } else if (results) {
                res.json({ results: results })      
            }
        });
    }
}


async function playlist_search(req, res) {
    var ArtistName = req.query.ArtistName  
    var TrackName = req.query.TrackName  
    if (!ArtistName && !TrackName) {
        ArtistName = 'ab'
        TrackName = 'de'
    } else if (ArtistName && !TrackName) {
        ArtistName = req.query.ArtistName
        TrackName = ''
    } else if (!ArtistName && TrackName) {
        ArtistName = ''
        TrackName = req.query.TrackName
    }
    // console.log(ArtistName)
    // console.log(TrackName)

    // When page is defined:
    if (req.query.page && !isNaN(req.query.page)) {
        const page = req.query.page
        const pagesize = req.query.pagesize ? req.query.pagesize : 10
        connection.query(`WITH New_Artists AS (
                              SELECT id, name, genres
                              FROM Artists
                              WHERE LOWER(name) LIKE '%${ArtistName}%' 
                          ), New_Albums AS (
                              SELECT id, artist_id, name, images 
                              FROM Albums
                          ), New_Tracks AS (
                              SELECT id, album_id, name, preview_url 
                              FROM Tracks
                              WHERE LOWER(name) LIKE '%${TrackName}%'
                          )
                          SELECT T.id AS TrackId, T.name AS TrackName, T.preview_url AS Preview,
                                 AL.name AS AlbumName, AL.images AS Cover, A.name AS ArtistName,
                                 A.genres AS Genre 
                          FROM New_Artists A
                          JOIN New_Albums AL ON AL.artist_id = A.id 
                          JOIN New_Tracks T ON AL.id = T.album_id 
                          ORDER BY A.name, T.name
                          LIMIT ${(page * pagesize) - (pagesize - 1)}, ${pagesize}`, function (error, results, fields) {
            if (error) {
                console.log(error)
                res.json({ error: error })
            } else if (results) {
                res.json({ results: results })      
            }
        });
    // When page is not defined:
    } else {
        connection.query(`WITH New_Artists AS (
                            SELECT id, name, genres
                            FROM Artists
                            WHERE LOWER(name) LIKE '%${ArtistName}%' 
                        ), New_Albums AS (
                            SELECT id, artist_id, name, images 
                            FROM Albums
                        ), New_Tracks AS (
                            SELECT id, album_id, name, preview_url 
                            FROM Tracks
                            WHERE LOWER(name) LIKE '%${TrackName}%'
                        )
                        SELECT T.id AS TrackId, T.name AS TrackName, T.preview_url AS Preview,
                               AL.name AS AlbumName, AL.images AS Cover, A.name AS ArtistName,
                               A.genres AS Genre 
                        FROM New_Artists A
                        JOIN New_Albums AL ON AL.artist_id = A.id 
                        JOIN New_Tracks T ON AL.id = T.album_id 
                        ORDER BY A.name, T.name`, function (error, results, fields) {
            if (error) {
                console.log(error)
                res.json({ error: error })
            } else if (results) {
                res.json({ results: results })      
            }
        });
    }
}

 
async function playlist_getSong(req, res) {
    const id = req.query.id ? req.query.id : ''
    connection.query(`WITH New_Artists AS ( 
                            SELECT id, name, genres 
                            FROM Artists
                        ), New_Albums AS (
                            SELECT id, artist_id, name, images 
                            FROM Albums
                        ), New_Tracks AS (
                            SELECT id, album_id, name, preview_url 
                            FROM Tracks
                            WHERE id = '${id}'
                        )
                        SELECT T.id AS TrackId, T.name AS TrackName, T.preview_url AS Preview,
                               AL.name AS AlbumName, AL.images AS Cover, A.name AS ArtistName,
                               A.genres AS Genre
                        FROM New_Artists A
                        JOIN New_Albums AL ON AL.artist_id = A.id 
                        JOIN New_Tracks T ON AL.id = T.album_id`, function (error, results, fields) {
        if (error) {
            console.log(error)
            res.json({ error: error })
        } else if (results) {
            res.json({ results: results })      
        }
    });
}


async function playlist_insertSong(req, res) {
    const id = req.query.id ? req.query.id : ''
    connection.query(`INSERT INTO Playlist(TrackId, TrackName, Preview, AlbumName, Cover, ArtistName, Genre)
                        SELECT T.id, T.name, T.preview_url, AL.name, AL.images, A.name, A.genres
                        FROM Albums AL 
                        JOIN Artists A ON AL.artist_id = A.id 
                        JOIN music_app.Tracks T ON AL.id = T.album_id
                        WHERE T.id = '${id}'`, function (error, results, fields) {
        if (error) {
            console.log(error)
            res.json({ error: error })
        } else if (results) {
            res.json({ results: 'insert' })      
        }
    });
}  



/////////// WORD CLOUD ////////////
async function wordcloud_artists (req, res) {
    const ArtistName = req.query.ArtistName ? req.query.ArtistName : 'stella'
    connection.query(
      `WITH Content AS (
            SELECT id, name, album_type 
            FROM Albums
            WHERE artist_id IN
                ( SELECT id
                FROM Artists A
                WHERE LOWER(name) LIKE '%${ArtistName}%')
        ), New_Tracks AS (
            SELECT album_id, name, popularity 
            FROM Tracks
        )
        SELECT C.name AS AlbumName, C.album_type AS AlbumType, 
               T.name AS TrackName, T.popularity AS Popularity
        FROM Content C
        JOIN New_Tracks T ON T.album_id = C.id 
        ORDER BY T.popularity DESC`,
      function (error, results, fields) {
        if (error) {
          console.log(error)
          res.json({ error: error })
        } else if (results) {
          res.json({ results: results })
        }
      }
    )
  } 

/////////// WHO SANG IT BETTER ////////////
async function popularity_getCompResults (req, res) {
    connection.query(
      `WITH DuplicateTrackName AS (
        SELECT T.name
        FROM Tracks T
            JOIN Albums A on T.album_id = A.id
            JOIN Artists Ar on A.artist_id = Ar.id
        WHERE Ar.name != 'Various Artists'
        GROUP BY T.name
        HAVING COUNT(DISTINCT(Ar.id)) > 1
        ORDER BY RAND()
        LIMIT 1
      ),
      DupicateTrackIds AS (
        SELECT Tracks.id
        FROM Tracks
        JOIN DuplicateTrackName DTN ON DTN.name = Tracks.name
      )
      SELECT Tracks.id          AS TrackId,
           Tracks.name        	AS TrackName,
           MAX(Tracks.popularity)  AS TrackPopularity,
           Artists.id         	AS ArtistId,
           Artists.name       	AS ArtistName,
           MAX(artist_popularity)  AS ArtistPopularity,
           Artists.followers  	AS ArtistFollowers,
           Albums.id          	AS AlbumId,
           Albums.name        	AS AlbumName,
           Albums.images      	AS AlbumImages
      FROM Tracks
            JOIN DupicateTrackIds ON Tracks.id = DupicateTrackIds.id
            JOIN Albums ON Tracks.album_id = Albums.id
            JOIN Artists ON Albums.artist_id = Artists.id
      GROUP BY artist_id
      ORDER BY RAND()
      LIMIT 2`,
      function (error, results, fields) {
        if (error) {
          console.log(error)
          res.json({ error: error })
        } else if (results) {
          res.json({ results: results })
        }
      }
    )
  }
  
  async function popularity_getsong (req, res) {
    const id = req.query.id ? req.query.id : ''
    connection.query(
      ` WITH New_Artists AS (
            SELECT id, name, followers, artist_popularity 
            FROM Artists
        ), New_Albums AS (
            SELECT id, artist_id, name, images 
            FROM Albums
        ), New_Tracks AS (
            SELECT id, album_id, name, preview_url 
            FROM Tracks
            WHERE id = '${id}' 
        )
        SELECT T.name   	         AS TrackName,
            Ar.name  	             AS ArtistName,
            Ar.followers             AS ArtistFollowers,
            Ar.artist_popularity,
            Al.name   	             AS AlbumName,
            Al.images 	             AS AlbumImages,
            T.preview_url     
        FROM New_Artists Ar
        JOIN New_Albums Al ON Al.artist_id = Ar.id 
        JOIN New_Tracks T ON T.album_id = Al.id`,
      function (error, results, fields) {
        if (error) {
          console.log(error)
          res.json({ error: error })
        } else if (results) {
          res.json({ results: results })
        }
      }
    )
  }
  
  

module.exports = {
    playlist_getAllSongs,
    playlist_getPlaylist,
    playlist_search,
    playlist_getSong,
    playlist_insertSong,
    wordcloud_artists,
    popularity_getCompResults,
    popularity_getsong
}
 