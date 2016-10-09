module UnreliableMinitestPlugin
  def before_setup
    skip if ENV['CI']
  end
end
