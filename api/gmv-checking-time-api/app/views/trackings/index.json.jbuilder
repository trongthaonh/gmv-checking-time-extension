json.array!(@trackings) do |tracking|
  json.extract! tracking, :id, :chatwork_id, :name, :tracking_type
  json.url tracking_url(tracking, format: :json)
end
