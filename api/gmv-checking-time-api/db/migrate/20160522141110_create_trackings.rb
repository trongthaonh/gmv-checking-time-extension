class CreateTrackings < ActiveRecord::Migration
  def change
    create_table :trackings do |t|
      t.integer :chatwork_id
      t.string :name
      t.integer :tracking_type

      t.timestamps null: false
    end
  end
end
