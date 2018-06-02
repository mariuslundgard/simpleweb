location = /events/home {
  proxy_pass http://www.mariuslundgard.com;
  proxy_set_header Connection "";
  proxy_http_version 1.1;
  proxy_buffering off;
  proxy_cache off;

  proxy_connect_timeout 3600;
  proxy_send_timeout 3600;
  proxy_read_timeout 3600;

  keepalive_requests 100;
  keepalive_timeout 3600;

  chunked_transfer_encoding off;
}

location = /admin/events/home {
  proxy_pass http://www.mariuslundgard.com;
  proxy_set_header Connection "";
  proxy_http_version 1.1;
  proxy_buffering off;
  proxy_cache off;

  proxy_connect_timeout 3600;
  proxy_send_timeout 3600;
  proxy_read_timeout 3600;

  keepalive_requests 100;
  keepalive_timeout 3600;

  chunked_transfer_encoding off;
}
