var app = angular.module('app', []);
app.controller('controller', function($scope, $timeout, $http, $log) {
    $scope.username = sessionStorage.username;
    $scope.initTime = new Date().getTime();
    $scope.videos = [];
    $scope.currentVideo = function() {
      var playing = $scope.videos.filter(function(video) { return video.playing; });
      return playing.length == 1 ? playing[0] : null;
    };

    $scope.startTime = function() {
      var video = $scope.currentVideo();
      return video ? Math.max(Math.floor(($scope.initTime - new Date(video.startTime).getTime()) / 1000), 0) : 0;
    };

    $scope.getIframeSrc = function() {
      var video = $scope.currentVideo();
      return video ? 'https://www.youtube.com/embed/' + video.key + '?autoplay=1&start=' + $scope.startTime() : '';
    };

    $scope.getAllVideos = function() {
      io.socket.get('/video/subscribe');

      $http.get('/video/recent').success(function(videos) {
        $log.log('Got all videos');
        $log.log(videos);
        $scope.videos = videos;
      });
    };

    $scope.getAllVideos();

    io.socket.on('video', function(obj) {
      $log.log('Received a video update');
      $log.log(obj);
      if (obj.verb === 'created') {
          $scope.videos.push(obj.data);
      } else if (obj.verb === 'updated') {
        var video = $scope.videos.filter(function(v) { return v.id === obj.data.id; });
        if (video.length === 1) {
          $scope.videos[$scope.videos.indexOf(video[0])] = obj.data;
        }
      }
      $scope.$digest();
    });

    $scope.upcoming = function() {
      return $scope.videos.filter(function(video) { return !video.played && !video.playing; });
    };

    $scope.recent = function() {
      return $scope.videos.filter(function(video) { return video.played && !video.playing; });
    };

    $scope.addVideo = function() {
      sessionStorage.username = $scope.username;
      $log.log('Adding video');
      $log.log($scope.link);
      $http.post('/api/add', {
        link: $scope.link,
        user: $scope.username
      }).success(function() {
        $scope.link = '';
      });
    };
}).config(function($sceProvider) {
    $sceProvider.enabled(false);
});
