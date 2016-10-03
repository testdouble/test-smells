# Subject under test
require 'rbconfig'

def join_path(fragments)
  if /mswin/ =~ RbConfig::CONFIG['host_os']
    separator = "\\"
    pattern = /\\+/
  else
    separator = "/"
    pattern = /\/+/
  end
  fragments.join(separator).gsub(pattern, separator)
end

# Test
class Indecisive < SmellTest
  def test_simple_case
    fragments = ["foo", "bar", "baz"]

    result = join_path(fragments)

    if /mswin/ =~ RbConfig::CONFIG['host_os']
      assert_equal "foo\\bar\\baz", result
    else
      assert_equal "foo/bar/baz", result
    end
  end

  def test_contains_separators
    if /mswin/ =~ RbConfig::CONFIG['host_os']
      fragments = ["\\foo\\", "bar\\biz", "baz\\"]
    else
      fragments = ["/foo/", "bar/biz", "baz/"]
    end

    result = join_path(fragments)

    if /mswin/ =~ RbConfig::CONFIG['host_os']
      assert_equal "\\foo\\bar\\biz\\baz\\", result
    else
      assert_equal "/foo/bar/biz/baz/", result
    end
  end
end
